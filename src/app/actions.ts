"use server";

import { ICheckoutUrl, planService } from "@/services/plan";
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
