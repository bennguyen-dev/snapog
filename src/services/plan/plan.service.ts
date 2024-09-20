import {
  getProduct,
  listPrices,
  listProducts,
  Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Plan } from "@prisma/client";

import { prisma } from "@/lib/db";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { IResponse } from "@/lib/type";
import { NewPlan } from "@/services/plan";

class PlanService {
  async syncPlans(): Promise<IResponse<Plan[] | null>> {
    configureLemonSqueezy();

    try {
      // Fetch all the variants from the database.
      const productVariants: Plan[] = await prisma.plan.findMany();

      // Helper function to add a variant to the productVariants array and sync it with the database.
      const _addVariant = async (variant: NewPlan) => {
        console.log(`Syncing variant ${variant.name} with the database...`);

        // Sync the variant with the plan in the database.
        const plan = await prisma.plan.upsert({
          where: { variantId: variant.variantId },
          update: variant,
          create: variant,
        });

        console.log(`${variant.name} synced with the database...`);
        // Ensure the variant is properly typed and includes the id from the plan.
        productVariants.push(plan);
      };

      // Fetch products from the Lemon Squeezy store.
      const products = await listProducts({
        filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
        include: ["variants"],
      });

      // Loop through all the variants.
      const allVariants = products.data?.included as
        | Variant["data"][]
        | undefined;

      if (allVariants) {
        for (const v of allVariants) {
          const variant = v.attributes;

          // Skip draft variants or if there's more than one variant, skip the default variant.
          if (
            variant.status === "draft" ||
            (allVariants.length !== 1 && variant.status === "pending")
          ) {
            continue;
          }

          // Fetch the Product name.
          const productName =
            (await getProduct(variant.product_id)).data?.data.attributes.name ??
            "";

          // Fetch the Price object.
          const variantPriceObject = await listPrices({
            filter: { variantId: v.id },
          });

          const currentPriceObj = variantPriceObject.data?.data.at(0);

          const isUsageBased =
            currentPriceObj?.attributes.usage_aggregation !== null;
          const interval =
            currentPriceObj?.attributes.renewal_interval_unit || null;
          const intervalCount =
            currentPriceObj?.attributes.renewal_interval_quantity || null;
          const trialInterval =
            currentPriceObj?.attributes.trial_interval_unit || null;
          const trialIntervalCount =
            currentPriceObj?.attributes.trial_interval_quantity || null;
          const price = isUsageBased // Price is in cents
            ? currentPriceObj?.attributes.unit_price_decimal
            : currentPriceObj?.attributes.unit_price;
          const priceString = price !== null ? price?.toString() ?? "" : "";
          const isSubscription =
            currentPriceObj?.attributes.category === "subscription";
          const packageSize = currentPriceObj?.attributes.package_size || null;

          // If not a subscription, skip it.
          if (!isSubscription) {
            continue;
          }

          await _addVariant({
            name: variant.name,
            description: variant.description,
            price: priceString,
            interval,
            intervalCount,
            isUsageBased,
            productId: variant.product_id,
            productName,
            variantId: parseInt(v.id) as unknown as number,
            trialInterval,
            trialIntervalCount,
            sort: variant.sort,
            packageSize,
          });
        }
      }

      return {
        status: 200,
        message: "Plans synced successfully",
        data: productVariants,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async getAll(): Promise<IResponse<Plan[] | null>> {
    try {
      let plans = await prisma.plan.findMany();

      if (!plans.length) {
        const syncResponse = await this.syncPlans();

        if (!syncResponse.data) {
          return syncResponse;
        }

        plans = syncResponse.data;
      }

      // Sort plans by packageSize
      plans.sort((a, b) => (a.packageSize ?? 0) - (b.packageSize ?? 0));

      return {
        status: 200,
        message: "Plans fetched and sorted successfully",
        data: plans,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const planService = new PlanService();
