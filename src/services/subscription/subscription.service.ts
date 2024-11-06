import {
  cancelSubscription,
  Subscription,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { IResponse } from "@/lib/type";
import {
  ICancelSubscription,
  IChangeSubscription,
  IGetUserSubscription,
  IUserSubscription,
  SUBSCRIPTION_STATUS,
} from "@/services/subscription";

class SubscriptionService {
  async getUserSubscription({
    userId,
  }: IGetUserSubscription): Promise<IResponse<IUserSubscription | null>> {
    try {
      const userSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SUBSCRIPTION_STATUS.ACTIVE,
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!userSubscription) {
        return {
          data: null,
          message: "No subscriptions found for this user",
          status: 200,
        };
      }

      return {
        message: "Successfully fetched user subscriptions",
        status: 200,
        data: userSubscription,
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

  async cancelSub({
    lemonSqueezyId,
    userId,
  }: ICancelSubscription): Promise<IResponse<Subscription | null>> {
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await subscriptionService.getUserSubscription({
      userId,
    });

    // Check if the subscription exists
    if (userSubscriptions.data?.lemonSqueezyId !== lemonSqueezyId) {
      return {
        status: 404,
        message: `Subscription #${lemonSqueezyId} not found.`,
        data: null,
      };
    }

    const cancelledSub = await cancelSubscription(lemonSqueezyId);

    if (cancelledSub.error) {
      return {
        status: 500,
        message: cancelledSub.error.message,
        data: null,
      };
    }

    // Update the db
    try {
      await prisma.subscription.update({
        where: { lemonSqueezyId },
        data: {
          status: cancelledSub.data.data.attributes.status,
          statusFormatted: cancelledSub.data.data.attributes.status_formatted,
          endsAt: cancelledSub.data.data.attributes.ends_at,
        },
      });
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : `Failed to cancel Subscription #${lemonSqueezyId} in the database.`,
        data: null,
      };
    }

    revalidatePath("/");

    return {
      status: 200,
      message: `Subscription #${lemonSqueezyId} cancelled successfully.`,
      data: cancelledSub.data,
    };
  }

  async updateSub({
    userId,
    currentPlanId,
    newPlanId,
  }: IChangeSubscription): Promise<IResponse<Subscription | null>> {
    configureLemonSqueezy();

    const userSubscriptions = await this.getUserSubscription({ userId });

    if (
      !userSubscriptions?.data ||
      userSubscriptions?.data?.planId !== currentPlanId
    ) {
      throw new Error(
        `No subscription with plan id #${currentPlanId} was found.`,
      );
    }

    const newPlan = await prisma.plan.findUnique({
      where: {
        id: newPlanId,
      },
    });

    if (!newPlan?.variantId) {
      throw new Error(`No plan with id #${newPlanId} was found.`);
    }

    // Send request to Lemon Squeezy to change the subscription.
    const updatedSub = await updateSubscription(
      userSubscriptions.data.lemonSqueezyId,
      {
        variantId: newPlan.variantId,
      },
    );

    // Start a transaction to update both subscription and usage
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update subscription
        const updatedSubscription = await tx.subscription.update({
          where: { lemonSqueezyId: userSubscriptions.data?.lemonSqueezyId },
          data: {
            status: updatedSub.data?.data.attributes.status,
            statusFormatted: updatedSub.data?.data.attributes.status_formatted,
            endsAt: updatedSub.data?.data.attributes.ends_at,
            planId: newPlanId, // Update the plan ID
          },
        });

        // 2. Get current period info for usage tracking
        const today = new Date();
        const periodStart = today;
        const periodEnd = new Date(
          updatedSub.data?.data.attributes.renews_at || today,
        );

        // 3. Create new usage record for the new plan period
        await tx.userUsage.create({
          data: {
            userId,
            subscriptionId: updatedSubscription.id,
            periodStart,
            periodEnd,
            count: 0, // Reset usage count for new plan
          },
        });
      });

      revalidatePath("/");

      return {
        status: 200,
        message: `Subscription #${userSubscriptions.data.lemonSqueezyId} updated successfully.`,
        data: updatedSub.data,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : `Failed to update Subscription #${userSubscriptions.data.lemonSqueezyId}`,
        data: null,
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
