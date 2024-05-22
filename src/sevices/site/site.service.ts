import {
  ICreateSiteReq,
  IGetSiteByUserIdReq,
  ISiteDetail,
} from "@/sevices/site";
import { PrismaClient } from "@prisma/client";
import { IResponse } from "@/lib/type";

const prisma = new PrismaClient();

class SiteService {
  async create({
    userId,
    domain,
  }: ICreateSiteReq): Promise<IResponse<ISiteDetail | null>> {
    try {
      if (!domain) {
        return {
          message: "Domain is required",
          status: 400,
          data: null,
        };
      }

      if (!userId) {
        return {
          message: "userId is required",
          status: 400,
          data: null,
        };
      }

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

  async getByUserId({
    userId,
  }: IGetSiteByUserIdReq): Promise<IResponse<ISiteDetail | null>> {
    try {
      if (!userId) {
        return {
          message: "userId is required",
          status: 400,
          data: null,
        };
      }

      const site = await prisma.site.findFirst({
        where: {
          userId,
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
        message: "Site found successfully",
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
}

const siteService = new SiteService();

export default siteService;
