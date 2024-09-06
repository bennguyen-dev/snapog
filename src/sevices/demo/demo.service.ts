import { IMAGE_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  getImageLinkFromAWS,
  getUrlWithoutProtocol,
  sanitizeFilename,
} from "@/lib/utils";
import { crawlServiceV2 } from "@/sevices/crawlV2";
import {
  ICreateDemo,
  ICreateDemoResponse,
  IGetDemo,
  IGetDemoResponse,
} from "@/sevices/demo";
import { storageService } from "@/sevices/storage";

class DemoService {
  async getDemo({
    domain,
  }: IGetDemo): Promise<IResponse<IGetDemoResponse[] | null>> {
    console.time(`Get demo for domain: ${domain}`);
    try {
      const demo = await prisma.demo.findUnique({
        where: {
          domain,
        },
        include: {
          pages: true,
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
        data: demo.pages.map(
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
      console.error("Error generating OG images for domain:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Get demo for domain: ${domain}`);
    }
  }

  async createDemo({
    domain,
    numberOfImages = 3,
  }: ICreateDemo): Promise<IResponse<ICreateDemoResponse | null>> {
    console.time(`Create demo for domain: ${domain}`);
    try {
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
      const urls = await crawlServiceV2.getInternalLinksOfDomain({
        domain,
        limit: numberOfImages,
      });

      if (!urls.data) {
        return {
          status: urls.status,
          message: urls.message,
          data: null,
        };
      }

      // Step 2: Get info of URLs
      const urlsInfoPromises = urls.data?.urls.map((url) =>
        crawlServiceV2.crawlInfoByUrl({
          url,
          configScreenshot: { cacheLimit: 0 },
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
          pages: {
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
      console.error(`Error create demo for domain: ${domain}`, error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Create demo for domain: ${domain}`);
    }
  }
}

export const demoService = new DemoService();
