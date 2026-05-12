import { Demo } from "@prisma/client";

import { IMAGE_TYPES } from "@/constants";
import { prisma } from "@/lib/db";
import {
  ICreateDemo,
  ICreateDemoResponse,
  IGetDemo,
  IGetDemoResponse,
} from "@/services/demo";
import { scrapeService } from "@/services/scrapeApi";
import { storageService } from "@/services/storage";
import { IResponse } from "@/types/global";
import {
  getDomainName,
  getCdnImageUrl,
  getUrlWithoutProtocol,
  sanitizeFilename,
} from "@/utils";

class DemoService {
  async getDemo({
    url,
  }: IGetDemo): Promise<IResponse<IGetDemoResponse[] | null>> {
    console.time(`Get demo for url: ${url}`);
    try {
      const domain = getDomainName(url);

      const demo = await prisma.demo.findUnique({
        where: {
          domain,
        },
        include: {
          demoPages: true,
        },
      });

      if (!demo) {
        return {
          status: 404,
          message: "Demo not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Demo found",
        data: demo.demoPages.map(
          (page) =>
            ({
              ...page,
              SnapOgImage: page?.SnapOGImage
                ? getCdnImageUrl(page.SnapOGImage)
                : null,
            }) as IGetDemoResponse,
        ),
      };
    } catch (error) {
      console.error(`Error getting demo for url: ${url}`, error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Get demo for url: ${url}`);
    }
  }

  async getAllDemos(): Promise<IResponse<Demo[] | null>> {
    try {
      const demos = await prisma.demo.findMany();

      return {
        status: 200,
        message: "Demos found",
        data: demos,
      };
    } catch (error) {
      console.error("Error getting all demos", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async createDemo({
    url,
  }: ICreateDemo): Promise<IResponse<ICreateDemoResponse | null>> {
    console.time(`Create demo for url: ${url}`);
    try {
      const domain = getDomainName(url);

      const pageCrawlInfo = await scrapeService.scrapeInfo({
        url,
      });

      if (!pageCrawlInfo.data) {
        return {
          status: pageCrawlInfo.status,
          message: pageCrawlInfo.message,
          data: null,
        };
      }

      const { ogImage, title, description, screenshot } = pageCrawlInfo.data;
      if (!screenshot && !title) {
        return {
          status: 400,
          message: "No valid results found for the URL",
          data: null,
        };
      }

      let uploadRes = null;
      if (screenshot) {
        const folderName = sanitizeFilename(getUrlWithoutProtocol(domain));
        const fileName = `${sanitizeFilename(getUrlWithoutProtocol(url))}.${IMAGE_TYPES.PNG.EXTENSION}`;
        const key = `demo/${folderName}/${fileName}`;

        uploadRes = await storageService.uploadImage({
          image: screenshot,
          key,
        });
      }

      const demoPage = {
        url: getUrlWithoutProtocol(url),
        OGImage: ogImage,
        OGTitle: title,
        OGDescription: description,
        SnapOGImage: uploadRes?.data?.src,
      };

      const demo = await prisma.$transaction(async (tx) => {
        const demo = await tx.demo.upsert({
          where: { domain },
          create: { domain },
          update: {},
        });

        await tx.demoPage.deleteMany({
          where: {
            demoId: demo.id,
          },
        });

        await tx.demoPage.create({
          data: {
            demoId: demo.id,
            ...demoPage,
          },
        });

        return demo;
      });

      return {
        status: 200,
        message: "Demo created successfully",
        data: demo,
      };
    } catch (error) {
      console.error(`Error creating demo for url: ${url}`, error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Create demo for url: ${url}`);
    }
  }
}

export const demoService = new DemoService();
