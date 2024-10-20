import {
  cancelSubscription,
  Subscription,
} from "@lemonsqueezy/lemonsqueezy.js";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { IResponse } from "@/lib/type";
import {
  IUserSubscription,
  SUBSCRIPTION_STATUS,
} from "@/services/subscription";

class SubscriptionService {
  async getCurrentSubscription(): Promise<
    IResponse<IUserSubscription[] | null>
  > {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        data: null,
        message: "Unauthorized",
        status: 401,
      };
    }

    try {
      const userSubscriptions = await prisma.subscription.findMany({
        where: { userId },
        include: { plan: true },
      });

      if (userSubscriptions.length === 0) {
        return {
          data: null,
          message: "No subscriptions found for this user",
          status: 200,
        };
      }

      const { ACTIVE, PAUSED, CANCELLED } = SUBSCRIPTION_STATUS;

      // Show active subscriptions first, then paused, then canceled
      const sortedSubscriptions = userSubscriptions.sort((a, b) => {
        if (a.status === ACTIVE && b.status !== ACTIVE) {
          return -1;
        }

        if (a.status === PAUSED && b.status === CANCELLED) {
          return -1;
        }

        return 0;
      });

      return {
        message: "Successfully fetched user subscriptions",
        status: 200,
        data: sortedSubscriptions,
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

  async cancelSub(
    lemonSqueezyId: string,
  ): Promise<IResponse<Subscription | null>> {
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions =
      await subscriptionService.getCurrentSubscription();

    // Check if the subscription exists
    const subscription = userSubscriptions.data?.find(
      (sub) => sub.lemonSqueezyId === lemonSqueezyId,
    );

    if (!subscription) {
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
}

export const subscriptionService = new SubscriptionService();
