"use server";

import { ICheckoutUrl, planService } from "@/services/plan";

export async function getCheckoutUrl(res: ICheckoutUrl) {
  return await planService.getCheckoutUrl(res);
}
