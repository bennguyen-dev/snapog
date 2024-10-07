import {
  createWebhook,
  getPrice,
  listWebhooks,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Subscription, WebhookEvent } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { prisma } from "@/lib/db";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards";
import { INewWebhookEvent } from "@/services/webhook/webhook.interface";

class WebhookService {
  private async hasWebhook() {
    configureLemonSqueezy();

    const headersList = headers();
    const host = headersList.get("host");

    if (!host) {
      throw new Error("Missing host in header when check has webhook event");
    }

    // Check if a webhook exists on Lemon Squeezy.
    const allWebhooks = await listWebhooks({
      filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    });

    // Check if url ends with a slash. If not, add it.
    let webhookUrl = `https://${host}`;
    if (!webhookUrl.endsWith("/")) {
      webhookUrl += "/";
    }
    webhookUrl += "api/webhook";

    revalidatePath("/");

    return allWebhooks.data?.data.find(
      (wh) => wh.attributes.url === webhookUrl && wh.attributes.test_mode,
    );
  }

  /**
   * This action will set up a webhook on Lemon Squeezy to listen to
   * Subscription events. It will only set up the webhook if it does not exist.
   */
  async setupWebhook() {
    configureLemonSqueezy();

    const headersList = headers();
    const host = headersList.get("host");

    if (!host) {
      throw new Error("Missing host in header when setup webhook event");
    }

    // Check if url ends with a slash. If not, add it.
    let webhookUrl = `https://${host}`;
    if (!webhookUrl.endsWith("/")) {
      webhookUrl += "/";
    }
    webhookUrl += "api/webhook";

    console.log("Setting up a webhook on Lemon Squeezy (Test Mode)...");

    // Do not set a webhook on Lemon Squeezy if it already exists.
    let webhook = await this.hasWebhook();

    // If the webhook does not exist, create it.
    if (!webhook) {
      const newWebhook = await createWebhook(
        process.env.LEMONSQUEEZY_STORE_ID!,
        {
          secret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
          url: webhookUrl,
          testMode: true, // will create a webhook in Test mode only!
          events: [
            "subscription_created",
            "subscription_expired",
            "subscription_updated",
          ],
        },
      );

      webhook = newWebhook.data?.data;
    }

    console.log(`Webhook ${webhook?.id} created on Lemon Squeezy.`);

    revalidatePath("/");
  }

  async processWebhookEvent(webhookEvent: WebhookEvent) {
    configureLemonSqueezy();
    const headersList = headers();
    const host = headersList.get("host");

    const existingWebhookEvent = await prisma.webhookEvent.findUnique({
      where: {
        id: webhookEvent.id,
      },
    });
    if (!existingWebhookEvent) {
      throw new Error(
        `Webhook event #${webhookEvent.id} not found in the database.`,
      );
    }

    if (!host) {
      throw new Error(
        "Missing host in webhook event when processing webhook event",
      );
    }

    let processingError = "";
    const eventBody = webhookEvent.body;

    if (!webhookHasMeta(eventBody)) {
      processingError = "Event body is missing the 'meta' property.";
    } else if (webhookHasData(eventBody)) {
      if (webhookEvent.eventName.startsWith("subscription_payment_")) {
        // Save subscription invoices; eventBody is a SubscriptionInvoice
        // Not implemented.
      } else if (webhookEvent.eventName.startsWith("subscription_")) {
        // Save subscription events; obj is a Subscription
        const attributes = eventBody.data.attributes;
        const variantId = attributes.variant_id as string;

        // We assume that the Plan table is up to date.
        const plan = await prisma.plan.findUnique({
          where: {
            variantId: parseInt(variantId, 10),
          },
        });

        if (!plan) {
          processingError = `Plan with variantId ${variantId} not found.`;
        } else {
          // Update the subscription in the database.

          const priceId = attributes.first_subscription_item.price_id;

          // Get the price data from Lemon Squeezy.
          const priceData = await getPrice(priceId);
          if (priceData.error) {
            processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
          }

          const isUsageBased =
            attributes.first_subscription_item.is_usage_based;
          const price = isUsageBased
            ? priceData.data?.data.attributes.unit_price_decimal
            : priceData.data?.data.attributes.unit_price;

          const updateData = {
            lemonSqueezyId: eventBody.data.id,
            orderId: attributes.order_id as number,
            name: attributes.user_name as string,
            email: attributes.user_email as string,
            status: attributes.status as string,
            statusFormatted: attributes.status_formatted as string,
            renewsAt: attributes.renews_at as string,
            endsAt: attributes.ends_at as string,
            trialEndsAt: attributes.trial_ends_at as string,
            price: price?.toString() ?? "",
            isPaused: false,
            subscriptionItemId: attributes.first_subscription_item.id,
            isUsageBased: attributes.first_subscription_item.is_usage_based,
            userId: eventBody.meta.custom_data.user_id,
            planId: plan.id,
          };

          // Create/update subscription in the database.
          try {
            await prisma.subscription.upsert({
              where: {
                lemonSqueezyId: updateData.lemonSqueezyId,
              },
              update: updateData,
              create: updateData as Subscription, // Type assertion, ensure all required fields are present
            });
          } catch (error) {
            processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`;
            console.error(error);
          }
        }
      } else if (webhookEvent.eventName.startsWith("order_")) {
        // Save orders; eventBody is a "Order"
        /* Not implemented */
      } else if (webhookEvent.eventName.startsWith("license_")) {
        // Save license keys; eventBody is a "License key"
        /* Not implemented */
      }

      try {
        // Update the webhook event in the database.
        await prisma.webhookEvent.update({
          where: {
            id: webhookEvent.id,
          },
          data: {
            processed: true,
            processingError,
          },
        });
      } catch (error) {
        console.error(
          `Failed to update WebhookEvent #${webhookEvent.id} in the database.`,
          error,
        );
      }
    }
  }

  async storeWebhookEvent(eventName: string, body: INewWebhookEvent["body"]) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }

    try {
      return await prisma.webhookEvent.create({
        data: {
          eventName,
          processed: false,
          body: JSON.stringify(body), // Assuming body is stored as a JSON string
        },
      });
    } catch (error) {
      console.error("Error storing webhook event:", error);
    }
  }
}

export const webhookService = new WebhookService();
