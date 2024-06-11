import {
  ICreateSite,
  IDeleteAllSiteBy,
  IGetSiteBy,
  IGetSitesBy,
  ISiteDetail,
} from "@/sevices/site";
import { IResponse } from "@/lib/type";
import { pageService } from "@/sevices/page";
import { storageService } from "@/sevices/storage";
import { sanitizeFilename } from "@/lib/utils";
import { prisma } from "@/lib/db";

class SiteService {
  async create({
    userId,
    domain,
  }: ICreateSite): Promise<IResponse<ISiteDetail | null>> {
    try {
      const exists = await prisma.site.findFirst({
        where: {
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
        },
      });

      return {
        message: "Site created successfully",
        status: 200,
        data: site,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }

  async getBy({
    domain,
    userId,
    id,
  }: IGetSiteBy): Promise<IResponse<ISiteDetail | null>> {
    const site = await prisma.site.findFirst({
      where: {
        id,
        userId,
        domain,
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
      message: "Site found",
      status: 200,
      data: site,
    };
  }

  async getAllBy({
    userId,
  }: IGetSitesBy): Promise<IResponse<ISiteDetail[] | null>> {
    try {
      const sites = await prisma.site.findMany({
        where: {
          userId,
        },
      });

      return {
        message: "Sites fetched successfully",
        status: 200,
        data: sites,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }

  async deleteManyBy({
    userId,
    domain,
    id,
  }: IDeleteAllSiteBy): Promise<IResponse<null>> {
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

      // Delete folder from S3
      await storageService.deleteFolders({
        prefixes: sites.map((site) => sanitizeFilename(site.domain)),
      });

      return {
        message: "Sites deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }
}

export const siteService = new SiteService();
