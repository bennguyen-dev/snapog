import { CACHE_DURATION_DAYS } from "@/constants";
import { prisma } from "@/lib/db";
import { pageService } from "@/services/page";
import {
  ICreateSite,
  IDeleteSitesBy,
  IGetSiteBy,
  IGetSitesBy,
  ISiteDetail,
  IUpdateSiteBy,
} from "@/services/site";
import { IFilterParams, IResponse, IResponseWithCursor } from "@/types/global";

class SiteService {
  async create({
    userId,
    domain,
    cacheDurationDays = CACHE_DURATION_DAYS,
  }: ICreateSite): Promise<IResponse<ISiteDetail | null>> {
    try {
      const exists = await prisma.site.findFirst({
        where: {
          userId,
          domain,
        },
      });

      if (exists) {
        return {
          message: "Domain already exists",
          status: 400,
          data: null,
        };
      }

      const site = await prisma.site.create({
        data: {
          domain,
          userId,
          cacheDurationDays,
        },
      });

      return {
        message: "Site created successfully",
        status: 200,
        data: site,
      };
    } catch (error) {
      console.error(`Error creating site: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async getBy({
    domain,
    userId,
    id,
  }: IGetSiteBy): Promise<IResponse<ISiteDetail | null>> {
    let site: ISiteDetail | null = null;

    await prisma.$transaction(async (tx) => {
      if (userId && domain) {
        site = await tx.site.findUnique({
          where: {
            userId_domain: {
              userId,
              domain,
            },
          },
        });
      } else if (id) {
        site = await tx.site.findUnique({
          where: {
            id,
          },
        });
      }
    });

    if (!site) {
      return {
        message: "Site not found",
        status: 404,
        data: null,
      };
    }

    return {
      message: "Site found",
      status: 200,
      data: site,
    };
  }

  async getAllBy({
    userId,
    cursor,
    pageSize = 10,
    search,
    filter,
  }: IGetSitesBy & IFilterParams): Promise<
    IResponseWithCursor<ISiteDetail[] | null>
  > {
    try {
      const whereCondition: any = { userId };

      const dateFrom = filter?.dateFrom;
      const dateTo = filter?.dateTo;

      // Apply date range filter
      if (dateFrom || dateTo) {
        whereCondition.createdAt = {};

        if (dateFrom) {
          whereCondition.createdAt.gte = dateFrom;
        }

        if (dateTo) {
          whereCondition.createdAt.lte = dateTo;
        }
      }

      // Apply search filter
      if (search && search.trim() !== "") {
        whereCondition.domain = {
          contains: search,
          mode: "insensitive",
        };
      }

      const results = await prisma.site.findMany({
        where: whereCondition,
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor = null;
      if (results.length > pageSize) {
        const nextItem = results.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        message: "Sites fetched successfully",
        status: 200,
        data: {
          data: results,
          nextCursor,
        },
      };
    } catch (error) {
      console.error(`Error getting sites: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: {
          data: null,
          nextCursor: null,
        },
      };
    }
  }

  async updateBy({
    id,
    cacheDurationDays,
    overridePage = false,
  }: IUpdateSiteBy): Promise<IResponse<ISiteDetail | null>> {
    try {
      if (!id) {
        return {
          message: "Id is required",
          status: 400,
          data: null,
        };
      }

      if (overridePage) {
        await pageService.updateManyBy({ siteId: id, cacheDurationDays });
      }

      const site = await prisma.site.update({
        where: {
          id,
        },
        data: {
          cacheDurationDays,
        },
      });

      if (!site) {
        return {
          message: "Site not found",
          status: 404,
          data: null,
        };
      }

      return {
        message: "Sites updated successfully",
        status: 200,
        data: site,
      };
    } catch (error) {
      console.error(`Error updating sites: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async deleteManyBy({
    userId,
    domain,
    id,
  }: IDeleteSitesBy): Promise<IResponse<null>> {
    try {
      const sites = await prisma.site.findMany({
        where: {
          id,
          userId,
          domain,
        },
      });

      if (!sites) {
        return {
          message: "Sites not found",
          status: 404,
          data: null,
        };
      }

      for (const site of sites) {
        const deletePages = await pageService.deleteManyBy({ siteId: site.id });

        if (deletePages.status !== 200) {
          return deletePages;
        }
      }

      await prisma.site.deleteMany({
        where: {
          id,
          userId,
          domain,
        },
      });

      return {
        message: "Sites deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting sites: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const siteService = new SiteService();
