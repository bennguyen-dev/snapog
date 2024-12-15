import { Purchase } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  ICreatePurchase,
  IGetActivePurchases,
  IGetPurchaseById,
  IUpdatePurchase,
} from "@/services/purchase";
import { IResponse } from "@/types/global";

class PurchaseService {
  async create({
    name,
    description,
    creditAmount,
    price,
    active = true,
  }: ICreatePurchase): Promise<IResponse<Purchase | null>> {
    try {
      const purchase = await prisma.purchase.create({
        data: {
          name,
          description,
          creditAmount,
          price,
          active,
        },
      });

      return {
        data: purchase,
        message: "Purchase created successfully",
        status: 201,
      };
    } catch (error) {
      console.error("Error creating purchase:", error);
      return {
        data: null,
        message: "Failed to create purchase",
        status: 500,
      };
    }
  }

  async update({
    id,
    ...data
  }: IUpdatePurchase): Promise<IResponse<Purchase | null>> {
    try {
      const purchase = await prisma.purchase.update({
        where: { id },
        data,
      });

      return {
        data: purchase,
        message: "Purchase updated successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error updating purchase:", error);
      return {
        data: null,
        message: "Failed to update purchase",
        status: 500,
      };
    }
  }

  async getById({ id }: IGetPurchaseById): Promise<IResponse<Purchase | null>> {
    try {
      const purchase = await prisma.purchase.findUnique({
        where: { id },
      });

      if (!purchase) {
        return {
          data: null,
          message: "Purchase not found",
          status: 404,
        };
      }

      return {
        data: purchase,
        message: "Purchase retrieved successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error getting purchase:", error);
      return {
        data: null,
        message: "Failed to get purchase",
        status: 500,
      };
    }
  }

  async getActivePurchases({
    take = 10,
    skip = 0,
  }: IGetActivePurchases): Promise<IResponse<Purchase[]>> {
    try {
      const purchases = await prisma.purchase.findMany({
        where: { active: true },
        take,
        skip,
        orderBy: { price: "asc" },
      });

      return {
        data: purchases,
        message: "Active purchases retrieved successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error getting active purchases:", error);
      return {
        data: [],
        message: "Failed to get active purchases",
        status: 500,
      };
    }
  }
}

export const purchaseService = new PurchaseService();
