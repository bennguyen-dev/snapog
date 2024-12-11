import { Page } from "@prisma/client";

import { IMAGE_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  getUrlWithoutProtocol,
  getUrlWithProtocol,
  sanitizeFilename,
} from "@/lib/utils";
import {
  ICreatePage,
  IDeletePagesBy,
  IGetPageBy,
  IUpdatePagesBy,
} from "@/services/page";
import { scrapeService } from "@/services/scrapeApi";
import { storageService } from "@/services/storage";

class PageService {
  async create({ url, siteId }: ICreatePage): Promise<IResponse<Page | null>> {
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

    const existedPage = await prisma.page.findUnique({
      where: {
        siteId_url: {
          url: urlWithProtocol,
          siteId,
        },
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
    const pageCrawlInfo = await scrapeService.scrapeInfo({
      url: urlWithProtocol,
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
    const key = `${site.userId}/${folderName}/${fileName}`;

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
      const page = await prisma.page.create({
        data: {
          url: urlWithoutProtocol,
          siteId,
          cacheDurationDays: site.cacheDurationDays,
          imageSrc: uploadRes.data.src,
          imageExpiresAt: newExpiresAt,
          OGTitle: pageCrawlInfo.data.title,
          OGDescription: pageCrawlInfo.data.description,
        },
      });

      return {
        message: "Page created successfully",
        status: 200,
        data: page,
      };
    } catch (error) {
      console.error(`Error creating page: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async getAllBy({
    siteId,
  }: {
    siteId: string;
  }): Promise<IResponse<Page[] | null>> {
    try {
      const pages = await prisma.page.findMany({
        where: {
          siteId,
        },
      });

      return {
        message: "Pages found",
        status: 200,
        data: pages,
      };
    } catch (error) {
      console.error(`Error getting pages: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async getBy({
    url,
    siteId,
    id,
  }: IGetPageBy): Promise<IResponse<Page | null>> {
    try {
      let page = null;
      await prisma.$transaction(async (tx) => {
        if (siteId && url) {
          page = await tx.page.findUnique({
            where: {
              siteId_url: {
                siteId,
                url,
              },
            },
          });
        } else if (id) {
          page = await tx.page.findUnique({
            where: {
              id,
            },
          });
        }
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
        data: page,
      };
    } catch (error) {
      console.error(`Error getting page: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async updateManyBy({
    id,
    siteId,
    cacheDurationDays,
  }: IUpdatePagesBy): Promise<IResponse<Page[] | null>> {
    if (!id && !siteId) {
      return {
        message: "Missing id or siteId",
        status: 400,
        data: null,
      };
    }

    try {
      // First get the pages to update
      const pagesToUpdate = await prisma.page.findMany({
        where: {
          id,
          siteId,
        },
      });

      if (!pagesToUpdate.length) {
        return {
          message: "No pages found to update",
          status: 404,
          data: null,
        };
      }

      // Update each page with new expiration time
      const updatedPages = await Promise.all(
        pagesToUpdate.map(async (page) => {
          const currentCacheDuration = page.cacheDurationDays || 0;
          const extendTime =
            ((cacheDurationDays || 0) - currentCacheDuration) *
            24 *
            60 *
            60 *
            1000; // Convert days to milliseconds

          return prisma.page.update({
            where: { id: page.id },
            data: {
              cacheDurationDays,
              updatedAt: new Date(),
              imageExpiresAt: page.imageExpiresAt
                ? new Date(page.imageExpiresAt.getTime() + extendTime)
                : null,
            },
          });
        }),
      );

      return {
        message: "Pages updated successfully",
        status: 200,
        data: updatedPages,
      };
    } catch (error) {
      console.error(`Error updating pages: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async deleteManyBy({ siteId, id }: IDeletePagesBy): Promise<IResponse<null>> {
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

      return {
        message: "Pages deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting pages: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const pageService = new PageService();
