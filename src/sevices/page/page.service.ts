import {
  ICreatePage,
  IDeleteManyPageBy,
  IGetPageBy,
  IPageDetail,
} from "@/sevices/page";
import {
  getUrlWithoutProtocol,
  sanitizeFilename,
  getUrlWithProtocol,
  getImageLinkFromAWS,
} from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import { IResponse } from "@/lib/type";
import { crawlService } from "@/sevices/crawl";
import { storageService } from "@/sevices/storage";
import { IMAGE_TYPES } from "@/lib/constants";

const prisma = new PrismaClient();

class PageService {
  async create({
    url,
    siteId,
  }: ICreatePage): Promise<IResponse<IPageDetail | null>> {
    const verifiedUrl = getUrlWithProtocol(url);
    const cleanProtocolUrl = getUrlWithoutProtocol(url);

    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });

    if (!site) {
      return {
        message: "Site not found",
        status: 404,
        data: null,
      };
    }

    // Check if page already exists
    const pageCrawlInfo = await crawlService.getInfoByUrl({ url: verifiedUrl });
    if (!pageCrawlInfo.data) {
      return {
        message: pageCrawlInfo.message,
        status: pageCrawlInfo.status,
        data: null,
      };
    }

    if (!pageCrawlInfo.data.screenShot) {
      return {
        message: "Failed to generate image",
        status: 400,
        data: null,
      };
    }

    // Upload screenshot to S3
    const uploadRes = await storageService.uploadImage({
      image: pageCrawlInfo.data?.screenShot,
      type: IMAGE_TYPES.PNG,
      fileName: sanitizeFilename(cleanProtocolUrl),
      folder: sanitizeFilename(site.domain),
    });

    if (!uploadRes.data) {
      return {
        message: uploadRes.message,
        status: uploadRes.status,
        data: null,
      };
    }

    try {
      const page = await prisma.page.create({
        data: {
          url: cleanProtocolUrl,
          siteId,
          OGImage: uploadRes.data.url,
          OGTitle: pageCrawlInfo.data.title,
          OGDescription: pageCrawlInfo.data.description,
        },
      });

      return {
        message: "Page created successfully",
        status: 200,
        data: page as IPageDetail,
      };
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }

  async getAllBy({
    siteId,
  }: {
    siteId: string;
  }): Promise<IResponse<IPageDetail[] | null>> {
    try {
      const pages = await prisma.page.findMany({
        where: {
          siteId,
        },
      });

      const data = pages.map((page) => ({
        ...page,
        OGImage: page?.OGImage ? getImageLinkFromAWS(page?.OGImage) : null,
      }));

      return {
        message: "Pages found",
        status: 200,
        data: data as IPageDetail[],
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
    url,
    siteId,
    id,
  }: IGetPageBy): Promise<IResponse<IPageDetail | null>> {
    try {
      const page = await prisma.page.findFirst({
        where: {
          url,
          siteId,
          id,
        },
      });

      if (!page) {
        return {
          message: "Page not found",
          status: 404,
          data: null,
        };
      }

      return {
        message: "Page found",
        status: 200,
        data: page as IPageDetail,
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
    siteId,
    id,
  }: IDeleteManyPageBy): Promise<IResponse<null>> {
    try {
      const pages = await prisma.page.findMany({
        where: {
          siteId,
          id,
        },
      });

      if (!pages) {
        return {
          message: "Page not found",
          status: 404,
          data: null,
        };
      }

      await prisma.page.deleteMany({
        where: {
          siteId,
          id,
        },
      });

      // delete image from storage
      for (const page of pages) {
        if (page.OGImage) {
          await storageService.deleteImage({ key: page.OGImage });
        }
      }

      return {
        message: "Pages deleted successfully",
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

export const pageService = new PageService();
