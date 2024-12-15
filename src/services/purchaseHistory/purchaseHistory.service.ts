import { PurchaseHistory } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  ICreatePurchaseHistory,
  IGetPurchaseHistoryById,
  IGetPurchaseHistoryByUserId,
} from "@/services/purchaseHistory";
import { userBalanceService } from "@/services/userBalance";
import { IResponse } from "@/types/global";

class PurchaseHistoryService {
  async create({
    userId,
    purchaseId,
    paidAmount,
    creditAmount,
  }: ICreatePurchaseHistory): Promise<IResponse<PurchaseHistory | null>> {
    try {
      // Use a transaction to ensure both operations succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // Create purchase history
        const purchaseHistory = await tx.purchaseHistory.create({
          data: {
            userId,
            purchaseId,
            paidAmount,
            creditAmount,
          },
        });

        // Get current user balance
        const balanceRes = await userBalanceService.getByUserId({ userId });

        if (!balanceRes.data) {
          // Create new balance if it doesn't exist
          await userBalanceService.create({
            userId,
            paidCredits: creditAmount,
          });
        } else {
          // Update existing balance
          await userBalanceService.update({
            userId,
            paidCredits: balanceRes.data.paidCredits + creditAmount,
          });
        }

        return purchaseHistory;
      });

      return {
        data: result,
        message: "Purchase history created successfully",
        status: 201,
      };
    } catch (error) {
      console.error("Error creating purchase history:", error);
      return {
        data: null,
        message: "Failed to create purchase history",
        status: 500,
      };
    }
  }

  async getByUserId({
    userId,
    take = 10,
    skip = 0,
  }: IGetPurchaseHistoryByUserId): Promise<IResponse<PurchaseHistory[]>> {
    try {
      const purchaseHistories = await prisma.purchaseHistory.findMany({
        where: { userId },
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          purchase: true,
        },
      });

      return {
        data: purchaseHistories,
        message: "Purchase histories retrieved successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error getting purchase histories:", error);
      return {
        data: [],
        message: "Failed to get purchase histories",
        status: 500,
      };
    }
  }

  async getById({
    id,
  }: IGetPurchaseHistoryById): Promise<IResponse<PurchaseHistory | null>> {
    try {
      const purchaseHistory = await prisma.purchaseHistory.findUnique({
        where: { id },
        include: {
          purchase: true,
        },
      });

      if (!purchaseHistory) {
        return {
          data: null,
          message: "Purchase history not found",
          status: 404,
        };
      }

      return {
        data: purchaseHistory,
        message: "Purchase history retrieved successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error getting purchase history:", error);
      return {
        data: null,
        message: "Failed to get purchase history",
        status: 500,
      };
    }
  }
}

export const purchaseHistoryService = new PurchaseHistoryService();
