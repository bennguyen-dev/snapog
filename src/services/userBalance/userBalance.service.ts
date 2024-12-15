import { UserBalance } from "@prisma/client";

import { DEFAULT_FREE_CREDIT } from "@/constants";
import { prisma } from "@/lib/db";
import {
  ICreateUserBalance,
  IDeductCredits,
  IGetUserBalanceByUserId,
  IUpdateUserBalance,
} from "@/services/userBalance";
import { IResponse } from "@/types/global";

class UserBalanceService {
  async create({
    userId,
    paidCredits = 0,
    freeCredits = DEFAULT_FREE_CREDIT, // Default free credits for new users
  }: ICreateUserBalance): Promise<IResponse<UserBalance | null>> {
    try {
      const userBalance = await prisma.userBalance.create({
        data: {
          userId,
          paidCredits,
          freeCredits,
          usedCredits: 0,
        },
      });

      return {
        data: userBalance,
        message: "User balance created successfully",
        status: 201,
      };
    } catch (error) {
      console.error("Error creating user balance:", error);
      return {
        data: null,
        message: "Failed to create user balance",
        status: 500,
      };
    }
  }

  async update({
    userId,
    ...data
  }: IUpdateUserBalance): Promise<IResponse<UserBalance | null>> {
    try {
      const userBalance = await prisma.userBalance.update({
        where: { userId },
        data,
      });

      return {
        data: userBalance,
        message: "User balance updated successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error updating user balance:", error);
      return {
        data: null,
        message: "Failed to update user balance",
        status: 500,
      };
    }
  }

  async getByUserId({
    userId,
  }: IGetUserBalanceByUserId): Promise<IResponse<UserBalance | null>> {
    try {
      const userBalance = await prisma.userBalance.findUnique({
        where: { userId },
      });

      if (!userBalance) {
        return {
          data: null,
          message: "User balance not found",
          status: 404,
        };
      }

      return {
        data: userBalance,
        message: "User balance retrieved successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error getting user balance:", error);
      return {
        data: null,
        message: "Failed to get user balance",
        status: 500,
      };
    }
  }

  async deductCredits({
    userId,
    amount,
  }: IDeductCredits): Promise<IResponse<UserBalance | null>> {
    try {
      // Get current balance
      const currentBalance = await prisma.userBalance.findUnique({
        where: { userId },
      });

      if (!currentBalance) {
        return {
          data: null,
          message: "User balance not found",
          status: 404,
        };
      }

      const totalAvailableCredits =
        currentBalance.paidCredits + currentBalance.freeCredits;
      const totalUsedCredits = currentBalance.usedCredits;

      if (totalAvailableCredits - totalUsedCredits < amount) {
        return {
          data: null,
          message: "Insufficient credits",
          status: 400,
        };
      }

      // Update the balance
      const updatedBalance = await prisma.userBalance.update({
        where: { userId },
        data: {
          usedCredits: totalUsedCredits + amount,
        },
      });

      return {
        data: updatedBalance,
        message: "Credits deducted successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error deducting credits:", error);
      return {
        data: null,
        message: "Failed to deduct credits",
        status: 500,
      };
    }
  }
}

export const userBalanceService = new UserBalanceService();
