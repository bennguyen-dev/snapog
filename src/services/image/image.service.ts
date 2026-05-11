import { IGenerateOGImage, IGenerateOGImageResponse } from "@/services/image";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { userService } from "@/services/user";
import { IResponse } from "@/types/global";
import { getDomainName, getUrlWithoutProtocol } from "@/utils";

class ImageService {
  async generateOGImage({
    url,
    apiKey,
    headers,
  }: IGenerateOGImage): Promise<IResponse<IGenerateOGImageResponse | null>> {
    const domain = getDomainName(url);

    try {
      const userRes = await userService.getUser({ apiKey });
      if (!userRes.data) {
        return { message: userRes.message, status: userRes.status, data: null };
      }

      const site = await siteService.getBy({ domain, userId: userRes.data.id });
      if (!site.data) {
        return { message: site.message, status: site.status, data: null };
      }

      const page = await pageService.getBy({
        url: getUrlWithoutProtocol(url),
        siteId: site.data.id,
      });

      if (page.data?.imageSrc) {
        return {
          message: "Image found",
          status: 200,
          data: { imageSrc: page.data.imageSrc },
        };
      }

      const newPage = await pageService.create({
        siteId: site.data.id,
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
