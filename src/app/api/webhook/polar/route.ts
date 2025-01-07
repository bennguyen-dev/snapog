import { Webhooks } from "@polar-sh/nextjs";

import { webhookService } from "@/services/webhook";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
  onPayload: webhookService.processWebhookEvent,
});
