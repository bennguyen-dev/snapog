import { ICreatePage, IPageDetail } from "@/sevices/page";
import {
  getUrlWithoutProtocol,
  sanitizeFilename,
  verifyUrl,
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
    const verifiedUrl = verifyUrl(url);
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

    // TODO: Check if page already exists
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
          title: pageCrawlInfo.data.title,
          description: pageCrawlInfo.data.description,
          image: uploadRes.data.url,
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
}

export const pageService = new PageService();
