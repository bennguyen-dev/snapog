import {
  BenefitLicenseKeys,
  ProductPriceOneTimeFixed,
} from "@polar-sh/sdk/models/components";
import { PrismaClient, Product } from "@prisma/client";

import { polarApi } from "@/lib/polar";
import { IResponse } from "@/types/global";

const prisma = new PrismaClient();

class ProductService {
  async syncProducts(): Promise<IResponse<Product[] | null>> {
    try {
      const products = await polarApi.products.list({
        limit: 10,
        isArchived: false,
        sorting: ["price_amount"],
      });

      const syncedProducts = await Promise.all(
        products.result.items.map(async (product) => {
          const price = product.prices.find(
            (price) =>
              price.type === "one_time" && price.amountType === "fixed",
          ) as ProductPriceOneTimeFixed;
          const license = product.benefits.find(
            (benefit) => benefit.type === "license_keys",
          ) as BenefitLicenseKeys;

          return prisma.product.upsert({
            where: { polarId: product.id },
            update: {
              name: product.name,
              description: product.description,
              isRecurring: product.isRecurring,
              isArchived: product.isArchived,
              polarModifiedAt: product.modifiedAt
                ? new Date(product.modifiedAt)
                : null,
              priceAmount: price.priceAmount,
              priceCurrency: price.priceCurrency,
              priceType: price.type,
              creditsAmount: license?.properties.limitUsage || 0,
              benefits: product.benefits,
              lastSyncedAt: new Date(),
            },
            create: {
              polarId: product.id,
              name: product.name,
              description: product.description,
              isRecurring: product.isRecurring,
              isArchived: product.isArchived,
              polarCreatedAt: new Date(product.createdAt),
              polarModifiedAt: product.modifiedAt
                ? new Date(product.modifiedAt)
                : null,
              priceAmount: price.priceAmount,
              priceCurrency: price.priceCurrency,
              priceType: price.type || "one_time",
              creditsAmount: license?.properties.limitUsage || 0,
              benefits: product.benefits,
              lastSyncedAt: new Date(),
            },
          });
        }),
      );

      return {
        data: syncedProducts,
        status: 200,
        message: "Products synced successfully",
      };
    } catch (error) {
      console.error(`Failed to sync products: ${error}`);
      return {
        data: null,
        status: 500,
        message: "Failed to sync products",
      };
    }
  }

  async getProducts(): Promise<IResponse<Product[] | null>> {
    try {
      const products = await prisma.product.findMany({
        where: { isArchived: false },
        orderBy: { priceAmount: "asc" },
      });

      return {
        data: products,
        status: 200,
        message: "Products fetched successfully",
      };
    } catch (error) {
      console.error(`Failed to get products: ${error}`);
      return {
        data: null,
        status: 500,
        message: "Failed to get products",
      };
    }
  }
}

export const productService = new ProductService();
