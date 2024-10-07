import { Prisma } from "@/lib/db";

export interface INewPlan extends Prisma.PlanCreateInput {}

export interface ICheckoutUrl {
  variantId: number;
  embed?: boolean;
}

export interface ICheckoutUrlResponse {
  url: string;
}
