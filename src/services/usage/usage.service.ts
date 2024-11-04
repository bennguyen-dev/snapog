import { Subscription } from "@prisma/client";

import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  SUBSCRIPTION_STATUS,
  subscriptionService,
} from "@/services/subscription";
import { USAGE_CONSTANTS } from "@/services/usage/usage.constant";

import {
  IGetUserUsage,
  IIncrementUsage,
  IUsageResponse,
} from "./usage.interface";

class UsageService {
  private async getCurrentPeriodInfo(userId: string): Promise<{
    subscription: Subscription | null;
    periodStart: Date | null;
    periodEnd: Date | null;
  }> {
    // Get active subscription if exists
    const { data: subscription } =
      await subscriptionService.getUserSubscription({
        userId,
      });

    let periodStart: Date | null = null;
    let periodEnd: Date | null = null;

    if (subscription) {
      // Set period start to subscription creation date
      periodStart = new Date(subscription.createdAt);

      // Calculate period end based on plan interval
      if (subscription.plan.interval === "month") {
        // Add one month to creation date
        periodEnd = new Date(subscription.createdAt);
        periodEnd.setMonth(
          periodEnd.getMonth() + (subscription.plan.intervalCount || 1),
        );
      } else if (subscription.plan.interval === "year") {
        // Add one year to creation date
        periodEnd = new Date(subscription.createdAt);
        periodEnd.setFullYear(
          periodEnd.getFullYear() + (subscription.plan.intervalCount || 1),
        );
      }

      // If subscription has renewsAt, use that as the period end
      if (subscription.renewsAt) {
        periodEnd = new Date(subscription.renewsAt);
      }

      // If subscription has endsAt (cancelled), use that as the period end
      if (subscription.endsAt) {
        periodEnd = new Date(subscription.endsAt);
      }
    }

    return { subscription, periodStart, periodEnd };
  }

  private async getUserLimit(userId: string): Promise<number> {
    const subscription = await prisma.subscription.findFirst({
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

    return subscription?.plan?.packageSize || USAGE_CONSTANTS.DEFAULT_LIMIT;
  }

  async getUserUsage({
    userId,
  }: IGetUserUsage): Promise<IResponse<IUsageResponse | null>> {
    try {
      const { subscription, periodStart, periodEnd } =
        await this.getCurrentPeriodInfo(userId);
      const limit = await this.getUserLimit(userId);

      const usage = await prisma.userUsage.findFirst({
        where: {
          userId,
          periodStart,
          periodEnd,
          subscriptionId: subscription?.id,
        },
      });

      return {
        status: 200,
        message: "Usage retrieved successfully",
        data: {
          current: usage?.count || 0,
          limit,
          periodStart,
          periodEnd,
        },
      };
    } catch (error) {
      console.error("Error getting user usage:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async incrementUsage({
    userId,
  }: IIncrementUsage): Promise<IResponse<IUsageResponse | null>> {
    try {
      const { subscription, periodStart, periodEnd } =
        await this.getCurrentPeriodInfo(userId);
      const limit = await this.getUserLimit(userId);

      // Get current usage
      const currentUsage = await prisma.userUsage.findFirst({
        where: {
          userId,
          periodStart,
          periodEnd,
          subscriptionId: subscription?.id,
        },
      });

      if ((currentUsage?.count || 0) >= limit) {
        return {
          status: 429,
          message: subscription
            ? "Usage limit exceeded for current period"
            : "Free tier limit reached. Please upgrade to continue creating images.",
          data: {
            current: currentUsage?.count || 0,
            limit,
            periodStart,
            periodEnd,
          },
        };
      }

      // Increment usage
      const usage = await prisma.userUsage.upsert({
        where: {
          id: currentUsage?.id || "new",
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          userId,
          subscriptionId: subscription?.id || null,
          periodStart,
          periodEnd,
          count: 1,
        },
      });

      return {
        status: 200,
        message: "Usage incremented successfully",
        data: {
          current: usage.count,
          limit,
          periodStart,
          periodEnd,
        },
      };
    } catch (error) {
      console.error("Error incrementing usage:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const usageService = new UsageService();
