import { Plan } from "@prisma/client";

export interface INewPlan
  extends Omit<Plan, "id" | "createdAt" | "updatedAt"> {}

export interface ICheckoutUrl {
  variantId: number;
  embed?: boolean;
}

export interface ICheckoutUrlResponse {
  url: string;
}
