"use server";

import { auth } from "@/auth";
import { ICheckoutUrl, planService } from "@/services/plan";
import { subscriptionService } from "@/services/subscription";
import { usageService } from "@/services/usage";
import { webhookService } from "@/services/webhook";

export async function getCheckoutUrl(res: ICheckoutUrl) {
  return await planService.getCheckoutUrl(res);
}

export async function getAllPlan() {
  return await planService.getAll();
}

export async function setupWebhook() {
  return await webhookService.setupWebhook();
}

export async function getCurrentSubscription() {
  return await subscriptionService.getCurrentSubscription();
}

export async function cancelSubscription(lemonSqueezyId: string) {
  return await subscriptionService.cancelSub(lemonSqueezyId);
}

// Add this new action alongside existing ones
export async function getUserUsage() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }

  return await usageService.getUserUsage({ userId: session.user.id });
}
