import { WebhookCheckoutUpdatedPayload } from "@polar-sh/sdk/models/components";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { LOG_STATUS, LOG_TYPE } from "@prisma/client";

import { prisma } from "@/lib/db";
import { productService } from "@/services/product";
import { userBalanceService } from "@/services/userBalance";
import { userLogService } from "@/services/userLog";

class WebhookService {
  async processWebhookEvent(payload: ReturnType<typeof validateEvent>) {
    if (payload.type === "checkout.updated") {
      const { data } = payload as WebhookCheckoutUpdatedPayload;

      // Save webhook event to database with checkout information
      const webhookEvent = await prisma.webhookEvent.create({
        data: {
          eventName: payload.type,
          body: payload as any,
          processed: false,
          checkoutId: data.id,
          checkoutStatus: data.status,
        },
      });

      try {
        // Only process credits update when status is succeeded
        if (data.status === "succeeded") {
          const userId = data.customerMetadata?.userId as string;
          const productId = data.customerMetadata?.productId as string;

          if (!userId || !productId) {
            throw new Error("Missing required metadata: userId or productId");
          }

          const productRes = await productService.getProductBy({
            id: productId,
            polarId: data.productId,
          });

          if (!productRes.data) {
            throw new Error(`Product SnapOG not found: ${productRes.message}`);
          }

          const creditsAmount = productRes.data.creditsAmount;

          // Update user's paid credits
          const balanceRes = await userBalanceService.incrementPaidCredits({
            userId: userId,
            amount: creditsAmount,
          });

          if (!balanceRes.data) {
            throw new Error(
              `Failed to update user's paid credits: ${balanceRes.message}`,
            );
          }

          userLogService.create({
            userId,
            amount: creditsAmount,
            type: LOG_TYPE.PURCHASE_CREDITS,
            status: LOG_STATUS.SUCCESS,
            metadata: {
              orderId: data.id,
              productId: productId,
              polarProductId: data.productId,
              productName: productRes.data.name,
              productPrice: data.amount,
              currency: data.currency,
              customerEmail: data.customerEmail,
              customerName: data.customerName,
              paymentStatus: data.status,
            },
          });

          console.log("Processed checkout updated event:", {
            userId,
            productId,
            polarId: data.productId,
            creditsAmount,
          });
        } else if (data.status === "failed" || data.status === "expired") {
          userLogService.create({
            userId: data.customerMetadata?.userId as string,
            amount: 0,
            type: LOG_TYPE.PURCHASE_CREDITS,
            status: LOG_STATUS.ERROR,
            metadata: {
              orderId: data.id,
              productId: data.customerMetadata?.productId as string,
              polarProductId: data.productId,
              productName: data.product.name,
              productPrice: data.amount,
              currency: data.currency,
              customerEmail: data.customerEmail,
              customerName: data.customerName,
              paymentStatus: data.status,
            },
          });
        } else {
          // For other statuses, just mark as processed since we don't need to do anything
          console.log(
            `Checkout status ${data.status} in checkout updated event:`,
            data,
          );
        }

        // Mark webhook as processed successfully
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { processed: true },
        });
      } catch (error) {
        // Save error message if processing failed
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            processed: false,
            processingError:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        });
        throw error;
      }
    } else {
      // Handle other webhook types
      await prisma.webhookEvent.create({
        data: {
          eventName: payload.type || "unknown",
          body: payload,
          processed: true, // Mark as processed since we don't need to do anything
        },
      });

      console.log("Unknown event type:", payload.type);
    }
  }
}

export const webhookService = new WebhookService();
