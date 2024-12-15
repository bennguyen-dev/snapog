"use server";

import { auth } from "@/auth";
import { userService } from "@/services/user";
import { userBalanceService } from "@/services/userBalance";

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
