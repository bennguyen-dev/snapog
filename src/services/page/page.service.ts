import { LOG_STATUS, LOG_TYPE, Page } from "@prisma/client";

import { IMAGE_TYPES } from "@/constants";
import { prisma } from "@/lib/db";
import {
  ICreatePage,
  IDeletePagesBy,
  IGetPageBy,
  IInvalidateCachePageBy,
  IUpdatePagesBy,
} from "@/services/page";
import { scrapeService } from "@/services/scrapeApi";
import { storageService } from "@/services/storage";
import { userBalanceService } from "@/services/userBalance";
import { userLogService } from "@/services/userLog";
import { IFilterParams, IResponse, IResponseWithCursor } from "@/types/global";
import {
  getDomainName,
  getImageLinkFromAWS,
  getUrlWithoutProtocol,
  getUrlWithProtocol,
  sanitizeFilename,
} from "@/utils";

class PageService {
  async create({
    url,
    siteId,
    headers,
  }: ICreatePage): Promise<IResponse<Page | null>> {
    const urlWithProtocol = getUrlWithProtocol(url);
    const urlWithoutProtocol = getUrlWithoutProtocol(url);
    const today = new Date();

    // Generate a unique lock key combining siteId and URL
    const lockKey = Buffer.from(`page:${siteId}:${urlWithProtocol}`).reduce(
      (a, b) => a + b,
      0,
    );

    try {
      // First check if page exists outside transaction
      const existingPage = await prisma.page.findUnique({
        where: {
          siteId_url: {
            url: urlWithProtocol,
            siteId,
          },
        },
      });

      if (existingPage) {
        return {
          message: "Page already exists",
          status: 200,
          data: existingPage,
        };
      }

      // Use transaction with increased timeout
      return await prisma.$transaction(
        async (tx) => {
          // Acquire exclusive lock immediately
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

          // Double check if page was created while we were waiting for lock
          const pageAfterLock = await tx.page.findUnique({
            where: {
              siteId_url: {
                url: urlWithProtocol,
                siteId,
              },
            },
          });

          if (pageAfterLock) {
            return {
              message: "Page already exists",
              status: 200,
              data: pageAfterLock,
            };
          }

          // Get site info and validate
          const site = await tx.site.findUnique({
            where: { id: siteId },
            select: {
              id: true,
              userId: true,
              domain: true,
              cacheDurationDays: true,
            },
          });

          if (!site) {
            return {
              message: "Site not found",
              status: 404,
              data: null,
            };
          }

          // Check credits early to fail fast
          const balanceRes = await userBalanceService.getByUserId({
            userId: site.userId,
          });

          if (!balanceRes.data) {
            return {
              message: "User balance not found",
              status: 404,
              data: null,
            };
          }

          const availableCredits =
            balanceRes.data.paidCredits +
            balanceRes.data.freeCredits -
            balanceRes.data.usedCredits;

          if (availableCredits < 1) {
            const userId = balanceRes.data.userId;
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            // Check if a similar log exists recently
            const recentInsufficientCreditLog = await prisma.userLog.findFirst({
              where: {
                userId: userId,
                type: LOG_TYPE.PAGE_CREATION,
                status: LOG_STATUS.ERROR,
                createdAt: { gte: oneWeekAgo },
                metadata: {
                  path: ["error", "message"],
                  equals: "Insufficient credits",
                },
              },
              select: { id: true },
            });

            if (!recentInsufficientCreditLog) {
              userLogService.create({
                userId: balanceRes.data.userId,
                amount: 0,
                type: LOG_TYPE.PAGE_CREATION,
                status: LOG_STATUS.ERROR,
                metadata: {
                  pageUrl: urlWithProtocol,
                  siteId,
                  userAgent: headers?.["user-agent"],
                  ipAddress:
                    headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
                  error: {
                    message: "Insufficient credits",
                    details: {
                      availableCredits,
                    },
                  },
                },
              });
            }

            return {
              message: "Insufficient credits",
              status: 400,
              data: null,
            };
          }

          // Perform expensive operations after all validations
          const pageCrawlInfo = await scrapeService.scrapeInfo({
            url: urlWithProtocol,
          });

          if (!pageCrawlInfo.data?.screenshot) {
            userLogService.create({
              userId: balanceRes.data.userId,
              amount: 0,
              type: LOG_TYPE.PAGE_CREATION,
              status: LOG_STATUS.ERROR,
              metadata: {
                pageUrl: urlWithProtocol,
                siteId,
                userAgent: headers?.["user-agent"],
                ipAddress:
                  headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
                error: {
                  message: pageCrawlInfo.message,
                  details: pageCrawlInfo,
                },
              },
            });

            return {
              message: pageCrawlInfo.message || "Failed to generate image",
              status: pageCrawlInfo.status || 500,
              data: null,
            };
          }

          // Prepare upload path
          const folderName = sanitizeFilename(site.domain);
          const fileName = `${sanitizeFilename(urlWithoutProtocol)}.${IMAGE_TYPES.PNG.EXTENSION}`;
          const key = `${site.userId}/${folderName}/${fileName}`;

          // Upload image
          const uploadRes = await storageService.uploadImage({
            image: pageCrawlInfo.data.screenshot,
            key: key,
          });

          if (!uploadRes.data?.src) {
            userLogService.create({
              userId: balanceRes.data.userId,
              amount: 0,
              type: LOG_TYPE.PAGE_CREATION,
              status: LOG_STATUS.ERROR,
              metadata: {
                pageUrl: urlWithProtocol,
                siteId,
                userAgent: headers?.["user-agent"],
                ipAddress:
                  headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
                error: {
                  message: uploadRes.message,
                  details: uploadRes,
                },
              },
            });

            return {
              message: uploadRes.message || "Failed to upload image",
              status: uploadRes.status || 500,
              data: null,
            };
          }

          // Calculate expiration
          const newExpiresAt = new Date(today);
          newExpiresAt.setDate(today.getDate() + (site.cacheDurationDays ?? 0));

          // Create page and deduct credit atomically
          const page = await tx.page.create({
            data: {
              url: urlWithProtocol,
              siteId,
              cacheDurationDays: site.cacheDurationDays,
              imageSrc: uploadRes.data.src,
              imageExpiresAt: newExpiresAt,
              OGTitle: pageCrawlInfo.data.title,
              OGDescription: pageCrawlInfo.data.description,
            },
          });

          // Deduct credit within same transaction
          await userBalanceService.deductCredits({
            userId: site.userId,
            amount: 1,
          });

          userLogService.create({
            userId: site.userId,
            amount: -1,
            type: LOG_TYPE.PAGE_CREATION,
            status: LOG_STATUS.SUCCESS,
            metadata: {
              pageUrl: urlWithProtocol,
              siteId,
              userAgent: headers?.["user-agent"],
              ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
            },
          });

          return {
            message: "Page created successfully",
            status: 200,
            data: page,
          };
        },
        {
          maxWait: 60000, // Maximum time to wait for transaction to start
          timeout: 120000, // Maximum time for transaction to complete
        },
      );
    } catch (error) {
      console.error("Error creating page:", error);
      return {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: 500,
        data: null,
      };
    }
  }

  async getAllBy({
    siteId,
    cursor,
    pageSize = 10,
    search,
    filter,
  }: IGetPageBy & IFilterParams): Promise<IResponseWithCursor<Page[] | null>> {
    try {
      const dateFrom = filter?.dateFrom;
      const dateTo = filter?.dateTo;

      const whereCondition: any = { siteId };

      // Apply date range filter
      if (dateFrom || dateTo) {
        whereCondition.imageExpiresAt = {};

        if (dateFrom) {
          whereCondition.imageExpiresAt.gte = dateFrom;
        }

        if (dateTo) {
          whereCondition.imageExpiresAt.lte = dateTo;
        }
      }

      // Apply search filter
      if (search && search.trim() !== "") {
        whereCondition.OR = [
          {
            url: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            OGTitle: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            OGDescription: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      const results = await prisma.page.findMany({
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

      const pagesWithFullImageUrls = results.map((page) => ({
        ...page,
        imageSrc: page.imageSrc ? getImageLinkFromAWS(page.imageSrc) : null,
      }));

      return {
        message: "Pages fetched successfully",
        status: 200,
        data: {
          data: pagesWithFullImageUrls,
          nextCursor,
        },
      };
    } catch (error) {
      console.error(`Error getting pages: ${error}`);
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

  async regenerate({
    id,
    userId,
    headers,
  }: IInvalidateCachePageBy): Promise<IResponse<Page | null>> {
    try {
      const page = await prisma.page.findUnique({
        where: { id },
        include: { site: true },
      });

      if (!page) {
        userLogService.create({
          userId,
          amount: 0,
          type: LOG_TYPE.PAGE_MANUAL_REFRESH,
          status: LOG_STATUS.ERROR,
          metadata: {
            pageId: id,
            userAgent: headers?.["user-agent"],
            ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
            error: {
              message: "Page not found",
            },
          },
        });

        return {
          message: "Page not found",
          status: 404,
          data: null,
        };
      }

      const balanceRes = await userBalanceService.getByUserId({
        userId,
      });

      if (!balanceRes.data) {
        return {
          message: "User balance not found",
          status: 404,
          data: null,
        };
      }

      const availableCredits =
        balanceRes.data.paidCredits +
        balanceRes.data.freeCredits -
        balanceRes.data.usedCredits;

      if (availableCredits < 1) {
        userLogService.create({
          userId,
          amount: 0,
          type: LOG_TYPE.PAGE_MANUAL_REFRESH,
          status: LOG_STATUS.ERROR,
          metadata: {
            pageUrl: page.url,
            siteId: page.siteId,
            userAgent: headers?.["user-agent"],
            ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
            error: {
              message: "Insufficient credits",
              details: {
                availableCredits,
              },
            },
          },
        });

        return {
          message: "Insufficient credits",
          status: 400,
          data: null,
        };
      }

      // Generate new screenshot
      const pageCrawlInfo = await scrapeService.scrapeInfo({
        url: page.url,
      });

      if (!pageCrawlInfo.data?.screenshot) {
        userLogService.create({
          userId: balanceRes.data.userId,
          amount: 0,
          type: LOG_TYPE.PAGE_MANUAL_REFRESH,
          status: LOG_STATUS.ERROR,
          metadata: {
            pageUrl: page.url,
            siteId: page.siteId,
            userAgent: headers?.["user-agent"],
            ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
            error: {
              message: pageCrawlInfo.message,
              details: pageCrawlInfo,
            },
          },
        });

        return {
          message: pageCrawlInfo.message || "Failed to generate image",
          status: pageCrawlInfo.status || 500,
          data: null,
        };
      }

      // Prepare upload path
      const domain = getDomainName(page.url);
      const urlWithoutProtocol = getUrlWithoutProtocol(page.url);
      const folderName = sanitizeFilename(domain);
      const fileName = `${sanitizeFilename(urlWithoutProtocol)}.${IMAGE_TYPES.PNG.EXTENSION}`;
      const key = `${userId}/${folderName}/${fileName}`;

      // Upload new image
      const uploadRes = await storageService.uploadImage({
        image: pageCrawlInfo.data.screenshot,
        key: key,
      });

      if (!uploadRes.data) {
        userLogService.create({
          userId: balanceRes.data.userId,
          amount: 0,
          type: LOG_TYPE.PAGE_MANUAL_REFRESH,
          status: LOG_STATUS.ERROR,
          metadata: {
            pageUrl: page.url,
            siteId: page.siteId,
            userAgent: headers?.["user-agent"],
            ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
            error: {
              message: uploadRes.message,
              details: uploadRes,
            },
          },
        });

        return {
          message: uploadRes.message || "Failed to upload image",
          status: uploadRes.status || 500,
          data: null,
        };
      }

      // Update page with new image and metadata
      const today = new Date();
      const newExpiresAt = new Date(today);
      newExpiresAt.setDate(today.getDate() + (page.cacheDurationDays ?? 0));

      const updatedPage = await prisma.page.update({
        where: { id },
        data: {
          imageSrc: uploadRes.data?.src,
          imageExpiresAt: newExpiresAt,
          OGTitle: pageCrawlInfo.data?.title,
          OGDescription: pageCrawlInfo.data?.description,
        },
      });

      // Deduct credit within same transaction
      await userBalanceService.deductCredits({
        userId,
        amount: 1,
      });

      userLogService.create({
        userId,
        amount: -1,
        type: LOG_TYPE.PAGE_MANUAL_REFRESH,
        status: LOG_STATUS.SUCCESS,
        metadata: {
          pageUrl: page.url,
          siteId: page.siteId,
          userAgent: headers?.["user-agent"],
          ipAddress: headers?.["x-forwarded-for"] || headers?.["x-real-ip"],
        },
      });

      return {
        message: "Image regenerated successfully",
        status: 200,
        data: updatedPage,
      };
    } catch (error) {
      console.error("Error regenerating page image:", error);
      return {
        message: "Failed to regenerate image",
        status: 500,
        data: null,
      };
    }
  }
}

export const pageService = new PageService();
