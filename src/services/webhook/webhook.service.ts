import { WebhookCheckoutUpdatedPayload } from "@polar-sh/sdk/models/components";
import { validateEvent } from "@polar-sh/sdk/webhooks";

import { productService } from "@/services/product";
import { userBalanceService } from "@/services/userBalance";

class WebhookService {
  async processWebhookEvent(payload: ReturnType<typeof validateEvent>) {
    console.log("payload 😋", { payload }, "");

    switch (payload.type) {
      case "checkout.updated": {
        const { data } = payload as WebhookCheckoutUpdatedPayload;

        if (data.status === "succeeded") {
          const userId = data.metadata?.userId as string;
          const productId = data.metadata?.productId as string;

          if (!userId || !productId) {
            console.log("Missing metadata in checkout updated event:", data);
            return;
          }

          const productRes = await productService.getProductBy({
            id: productId,
            polarId: data.productId,
          });

          if (!productRes.data) {
            console.log("Product not found in checkout updated event:", data);
            return;
          }

          const creditsAmount = productRes.data.creditsAmount;

          // Update user's paid credits
          const balanceRes = await userBalanceService.incrementPaidCredits({
            userId: userId,
            amount: creditsAmount,
          });

          if (!balanceRes.data) {
            console.log(
              "Failed to update user's paid credits in checkout updated event:",
              data,
            );
            return;
          }

          console.log("Processed checkout updated event:", {
            userId,
            productId,
            polarId: data.productId,
            creditsAmount,
          });
        } else {
          console.log(
            "Checkout not succeeded in checkout updated event:",
            data,
          );
        }
        break;
      }

      default: {
        console.log("Unknown event type:", payload.type);
        break;
      }
    }
  }
}

export const webhookService = new WebhookService();
