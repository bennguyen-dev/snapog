import { ProductPriceOneTimeFixed } from "@polar-sh/sdk/models/components";
import { Product } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { polarApi } from "@/lib/polar";
import {
  IGetCheckoutUrl,
  IGetCheckoutUrlResponse,
  IGetProductBy,
} from "@/services/product";
import { IResponse } from "@/types/global";

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
              creditsAmount: 0,
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
              creditsAmount: 0,
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

  async getCheckoutUrl({
    productId,
  }: IGetCheckoutUrl): Promise<IResponse<IGetCheckoutUrlResponse | null>> {
    try {
      const session = await auth();
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return {
          data: null,
          status: 404,
          message: "Product not found",
        };
      }

      const checkoutUrl = await polarApi.checkouts.custom.create({
        successUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_DOMAIN}/payment/success?checkoutId={CHECKOUT_ID}`,
        productId: product.polarId,
        customerEmail: session?.user.email,
      });

      return {
        data: {
          checkoutUrl: checkoutUrl.url,
        },
        status: 200,
        message: "Checkout URL fetched successfully",
      };
    } catch (error) {
      console.error(`Failed to get checkout URL: ${error}`);
      return {
        data: null,
        status: 500,
        message: "Failed to get checkout URL",
      };
    }
  }

  async getProductBy({
    id,
    polarId,
  }: IGetProductBy): Promise<IResponse<Product | null>> {
    try {
      const product = await prisma.product.findUnique({
        where: { id, polarId },
      });

      if (!product) {
        return {
          data: null,
          status: 404,
          message: "Product not found",
        };
      }

      return {
        data: product,
        status: 200,
        message: "Product fetched successfully",
      };
    } catch (error) {
      console.error(`Failed to get product: ${error}`);
      return {
        data: null,
        status: 500,
        message: "Failed to get product",
      };
    }
  }
}

export const productService = new ProductService();
