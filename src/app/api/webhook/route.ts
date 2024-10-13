import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { webhookHasMeta } from "@/lib/typeguards";
import { webhookService } from "@/services/webhook";

export async function POST(request: Request) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json({
      error: "Lemon Squeezy Webhook Secret not set in .env",
      status: 500,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*             First, make sure the request is from Lemon Squeezy.            */
  /* -------------------------------------------------------------------------- */

  // Get the raw body content.
  const rawBody = await request.text();

  // Get the webhook secret from the environment variables.
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  // Get the signature from the request headers.
  const signature = Buffer.from(
    request.headers.get("X-Signature") ?? "",
    "hex",
  );

  // Create a HMAC-SHA256 hash of the raw body content using the secret and
  // compare it to the signature.
  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex",
  );

  if (!crypto.timingSafeEqual(hmac, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  /* -------------------------------------------------------------------------- */
  /*                                Valid request                               */
  /* -------------------------------------------------------------------------- */

  const data = JSON.parse(rawBody) as unknown;

  // Type guard to check if the object has a 'meta' property.
  if (webhookHasMeta(data)) {
    const webhookEvent = await webhookService.storeWebhookEvent(
      data.meta.event_name,
      data,
    );

    if (!webhookEvent) {
      return NextResponse.json({
        error: "Failed to store webhook event",
        status: 500,
      });
    }

    // Non-blocking call to process the webhook event.
    void webhookService.processWebhookEvent(webhookEvent);

    return NextResponse.json({
      message: "Webhook event received and processing started",
      status: 200,
    });
  }

  return NextResponse.json({
    error: "Invalid webhook event",
    status: 400,
  });
}
