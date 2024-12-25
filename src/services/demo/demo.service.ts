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
  getImageLinkFromAWS,
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
                ? getImageLinkFromAWS(page.SnapOGImage)
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
    numberOfImages = 3,
  }: ICreateDemo): Promise<IResponse<ICreateDemoResponse | null>> {
    console.time(`Create demo for url: ${url}`);
    try {
      const domain = getDomainName(url);
      // Check if the domain already exists in the database
      const existingDomain = await prisma.demo.findUnique({
        where: {
          domain,
        },
      });

      if (existingDomain) {
        return {
          status: 200,
          message: "Domain already exists",
          data: existingDomain,
        };
      }

      // Step 1: Get URLs of the domain
      const linksRes = await scrapeService.scrapeInternalLinks({
        url,
        limit: numberOfImages,
      });

      if (linksRes.status === 404) {
        return {
          status: 404,
          message: linksRes.message,
          data: null,
        };
      }

      if (!linksRes.data) {
        throw new Error(linksRes.message);
      }

      // Step 2: Get info of URLs
      const urlsInfoPromises = linksRes.data?.links.map((url) =>
        scrapeService.scrapeInfo({
          url,
        }),
      );
      const urlsInfo = await Promise.all(urlsInfoPromises);

      // Step 3: Upload screenshots concurrently
      const uploadPromises = urlsInfo.map(async (result) => {
        if (result.data && result.data.screenshot) {
          const { url, ogImage, title, description, screenshot } = result.data;

          // Upload screenshot to S3
          let uploadRes = null;
          if (!!screenshot) {
            const folderName = sanitizeFilename(getUrlWithoutProtocol(domain));
            const fileName = `${sanitizeFilename(getUrlWithoutProtocol(url))}.${IMAGE_TYPES.PNG.EXTENSION}`;
            const key = `demo/${folderName}/${fileName}`;

            uploadRes = await storageService.uploadImage({
              image: screenshot,
              key: key,
            });
          }

          return {
            url: getUrlWithoutProtocol(url),
            OGImage: ogImage,
            OGTitle: title,
            OGDescription: description,
            SnapOGImage: uploadRes?.data?.src,
          };
        }
        return null;
      });

      const results = (await Promise.all(uploadPromises)).filter(
        (result) => !!result && !!result.SnapOGImage,
      );

      // Check if there are no valid results
      if (results.length === 0 || !results) {
        return {
          status: 400,
          message: "No valid results found for the domain",
          data: null,
        };
      }

      // Create a new demo entry in the database
      const newDemo = await prisma.demo.create({
        data: {
          domain,
          demoPages: {
            create: results as any,
          }, // Assuming you have an images field to store the results
        },
      });

      return {
        status: 200,
        message: "Domain created successfully",
        data: newDemo,
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
