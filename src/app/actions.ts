"use server";

import { ICheckoutUrl, planService } from "@/services/plan";
import { subscriptionService } from "@/services/subscription";
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
