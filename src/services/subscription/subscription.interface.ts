import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js";

import { Prisma } from "@/lib/db";

export interface INewSubscription extends Prisma.SubscriptionCreateInput {}

export interface IUserSubscription
  extends Prisma.SubscriptionGetPayload<{ include: { plan: true } }> {}

export type SubscriptionStatusType =
  Subscription["data"]["attributes"]["status"];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  CANCELLED: "cancelled",
};
