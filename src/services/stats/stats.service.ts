import { prisma } from "@/lib/db";
import { IStatsRequest, IStatsResponse } from "@/services/stats";
import { IResponse } from "@/types/global";

class StatsService {
  async getStats({
    userId,
  }: IStatsRequest): Promise<IResponse<IStatsResponse | null>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          balance: {
            select: {
              paidCredits: true,
              freeCredits: true,
              usedCredits: true,
            },
          },
          sites: {
            select: {
              id: true,
              domain: true,
              _count: {
                select: {
                  pages: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return {
          data: null,
          message: "User not found",
          status: 404,
        };
      }

      const { balance } = user;
      const totalCredits =
        (balance?.paidCredits || 0) + (balance?.freeCredits || 0);
      const usedCredits = balance?.usedCredits || 0;

      const sitesWithStats = user.sites.map((site) => ({
        id: site.id,
        name: site.domain,
        pageCount: site._count.pages,
      }));

      return {
        data: {
          credits: {
            total: totalCredits,
            used: usedCredits,
            remaining: totalCredits - usedCredits,
          },
          totalPages: sitesWithStats.reduce(
            (total, site) => total + site.pageCount,
            0,
          ),
          sites: {
            total: sitesWithStats.length,
            details: sitesWithStats,
          },
        },
        status: 200,
        message: "Stats fetched successfully",
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        data: null,
        status: 500,
        message: "Failed to get stats",
      };
    }
  }
}

export const statsService = new StatsService();
