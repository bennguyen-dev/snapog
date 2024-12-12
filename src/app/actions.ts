"use server";

import { auth } from "@/auth";
import { ICheckoutUrl, planService } from "@/services/plan";
import {
  IChangeSubscription,
  subscriptionService,
} from "@/services/subscription";
import { usageService } from "@/services/usage";
import { userService } from "@/services/user";
import { userBalanceService } from "@/services/userBalance";
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
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }

  return await subscriptionService.getUserSubscription({
    userId: session.user.id,
  });
}

export async function cancelSubscription(lemonSqueezyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }
  return await subscriptionService.cancelSub({
    lemonSqueezyId,
    userId: session.user.id,
  });
}

export async function updatePlan({
  currentPlanId,
  newPlanId,
}: Omit<IChangeSubscription, "userId">) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }

  return await subscriptionService.updateSub({
    currentPlanId,
    newPlanId,
    userId: session.user.id,
  });
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

export async function regenerateApikey() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }

  return userService.regenerateApiKey({ userId: session.user.id });
}

export async function getUserBalance() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: 401,
      message: "Unauthorized",
      data: null,
    };
  }

  return await userBalanceService.getByUserId({ userId: session.user.id });
}
