import { ICreateSite, IGetSitesByUserId, ISiteDetail } from "@/sevices/site";
import { PrismaClient } from "@prisma/client";
import { IResponse } from "@/lib/type";

const prisma = new PrismaClient();

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

  async getAllByUserId({
    userId,
  }: IGetSitesByUserId): Promise<IResponse<ISiteDetail[] | null>> {
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
}

export const siteService = new SiteService();
