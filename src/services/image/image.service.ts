import { prisma } from "@/lib/db";
import { IGenerateOGImage, IGenerateOGImageResponse } from "@/services/image";
import { pageService } from "@/services/page";
import { IResponse } from "@/types/global";
import { getDomainName, getUrlWithoutProtocol } from "@/utils";

class ImageService {
  async generateOGImage({
    url,
    apiKey,
    headers,
  }: IGenerateOGImage): Promise<IResponse<IGenerateOGImageResponse | null>> {
    const domain = getDomainName(url);
    const normalizedUrl = getUrlWithoutProtocol(url);

    try {
      const cachedPage = await prisma.page.findFirst({
        where: {
          imageSrc: {
            not: null,
          },
          OR: [{ url }, { url: normalizedUrl }],
          site: {
            domain,
            user: {
              apiKey,
            },
          },
        },
        select: {
          imageSrc: true,
        },
      });

      if (cachedPage?.imageSrc) {
        return {
          message: "Image found",
          status: 200,
          data: { imageSrc: cachedPage.imageSrc },
        };
      }

      const site = await prisma.site.findFirst({
        where: {
          domain,
          user: {
            apiKey,
          },
        },
        select: {
          id: true,
        },
      });

      if (!site) {
        return {
          message: "Site not found",
          status: 404,
          data: null,
        };
      }

      const newPage = await pageService.create({
        siteId: site.id,
        url,
        headers,
      });

      if (!newPage.data?.imageSrc) {
        return { message: newPage.message, status: newPage.status, data: null };
      }

      return {
        message: "Image created",
        status: 200,
        data: { imageSrc: newPage.data.imageSrc },
      };
    } catch (error) {
      console.error(`Error while getting image by url ${url}: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const imageService = new ImageService();
