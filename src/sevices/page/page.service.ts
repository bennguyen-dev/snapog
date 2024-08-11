import { revalidateTag } from "next/cache";

import { IMAGE_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  getKeyPathsCache,
  getUrlWithoutProtocol,
  getUrlWithProtocol,
  sanitizeFilename,
} from "@/lib/utils";
import { crawlServiceV2 } from "@/sevices/crawlV2";
import { ogImageService } from "@/sevices/ogImage";
import {
  ICreatePage,
  IDeletePagesBy,
  IGetPageBy,
  IPageDetail,
  IUpdatePagesBy,
} from "@/sevices/page";
import { storageService } from "@/sevices/storage";

class PageService {
  async create({
    url,
    siteId,
  }: ICreatePage): Promise<IResponse<IPageDetail | null>> {
    const urlWithProtocol = getUrlWithProtocol(url);
    const urlWithoutProtocol = getUrlWithoutProtocol(url);
    const today = new Date();

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

    const existedPage = await prisma.page.findFirst({
      where: {
        siteId: siteId,
        url: urlWithoutProtocol,
      },
    });

    if (existedPage) {
      return {
        message: "Page already exists",
        status: 400,
        data: null,
      };
    }

    // Check if page already exists
    const pageCrawlInfo = await crawlServiceV2.crawlInfoByUrl({
      url: urlWithProtocol,
      configScreenshot: {
        cacheLimit: 0,
      },
    });
    if (!pageCrawlInfo.data) {
      return {
        message: pageCrawlInfo.message,
        status: pageCrawlInfo.status,
        data: null,
      };
    }

    if (!pageCrawlInfo.data.screenshot) {
      return {
        message: "Failed to generate image",
        status: 400,
        data: null,
      };
    }

    // Upload screenshot to S3
    const folderName = sanitizeFilename(site.domain);
    const fileName = `${sanitizeFilename(urlWithoutProtocol)}.${IMAGE_TYPES.PNG.EXTENSION}`;
    const key = `${folderName}/${fileName}`;

    const uploadRes = await storageService.uploadImage({
      image: pageCrawlInfo.data?.screenshot,
      key: key,
    });

    if (!uploadRes.data) {
      return {
        message: uploadRes.message,
        status: uploadRes.status,
        data: null,
      };
    }

    const newExpiresAt = new Date();
    const cacheDurationDays = site.cacheDurationDays ?? 0;
    newExpiresAt.setDate(today.getDate() + cacheDurationDays);

    try {
      const ogImage = await ogImageService.create({
        src: uploadRes.data.src,
        expiresAt: newExpiresAt,
      });

      if (!ogImage.data) {
        return {
          message: ogImage.message,
          status: ogImage.status,
          data: null,
        };
      }

      const page = await prisma.page.create({
        data: {
          url: urlWithoutProtocol,
          siteId,
          cacheDurationDays: site.cacheDurationDays,
          OGImageId: ogImage.data.id,
          OGTitle: pageCrawlInfo.data.title,
          OGDescription: pageCrawlInfo.data.description,
        },
        include: {
          OGImage: true,
        },
      });

      revalidateTag(
        getKeyPathsCache({
          functionName: "imageService.getImageByUrl",
          value: { url: urlWithoutProtocol },
        }),
      );

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
        include: {
          OGImage: true,
        },
      });

      return {
        message: "Pages found",
        status: 200,
        data: pages as IPageDetail[],
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
        include: {
          OGImage: true,
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

  async updateManyBy({
    id,
    siteId,
    cacheDurationDays,
  }: IUpdatePagesBy): Promise<IResponse<IPageDetail[] | null>> {
    if (!id && !siteId) {
      return {
        message: "Missing id or siteId",
        status: 400,
        data: null,
      };
    }

    try {
      // Retrieve updated pages to update `expiresAt` in `OGImage`
      const updatedPages = await prisma.page.findMany({
        where: {
          id,
          siteId,
        },
        include: { OGImage: true },
      });

      const updatePromises = updatedPages.map((page) => {
        if (
          cacheDurationDays &&
          page.cacheDurationDays &&
          page.OGImageId &&
          page?.OGImage?.expiresAt
        ) {
          const extendTime =
            (cacheDurationDays - page.cacheDurationDays) * 24 * 60 * 60 * 1000;

          const expiresAt = new Date(
            page.OGImage.expiresAt.getTime() + extendTime,
          );

          return prisma.oGImage.update({
            where: { id: page.OGImageId },
            data: { expiresAt },
          });
        }
        return Promise.resolve();
      });

      await prisma.page.updateMany({
        where: {
          id,
          siteId,
        },
        data: {
          cacheDurationDays,
          updatedAt: new Date(),
        },
      });

      await Promise.all(updatePromises);

      return {
        message: "Pages updated successfully",
        status: 200,
        data: updatedPages as IPageDetail[],
      };
    } catch (error) {
      console.error("Error updating pages:", error);
      throw error;
    }
  }

  async deleteManyBy({ siteId, id }: IDeletePagesBy): Promise<IResponse<null>> {
    try {
      const pages = await prisma.page.findMany({
        where: {
          siteId,
          id,
        },
        include: {
          OGImage: true,
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

      // delete OGImages
      await Promise.all(
        pages
          .filter((page) => page.OGImageId)
          .map((page) =>
            ogImageService.deleteBy({ id: page.OGImageId as string }),
          ),
      );

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
