import { auth } from "@/auth";
import { prisma } from "@/lib/db";
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
          status: 404,
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
}

export const subscriptionService = new SubscriptionService();
