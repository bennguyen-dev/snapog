import { IResponse } from "@/lib/type";
import {
  getImageLinkFromAWS,
  getUrlWithProtocol,
  getUrlWithoutProtocol,
} from "@/lib/utils";
import {
  IGetImageByImageLink,
  IGetImageByImageLinkResponse,
  IGetImageByUrl,
  IGetImageByUrlResponse,
} from "@/sevices/image";
import { pageService } from "@/sevices/page";
import { siteService } from "@/sevices/site";

class ImageService {
  async getImageByUrl({
    url,
  }: IGetImageByUrl): Promise<IResponse<IGetImageByUrlResponse | null>> {
    url = getUrlWithoutProtocol(url);

    const urlObj = new URL(getUrlWithProtocol(url) as string);
    const domain = urlObj.hostname;

    try {
      // Check if the domain exists in the Site table
      const site = await siteService.getBy({ domain });

      if (!site.data) {
        return {
          message: site.message,
          status: site.status,
          data: null,
        };
      }

      // Check if the URL exists in the Page table for this site
      const page = await pageService.getBy({ url, siteId: site.data.id });
      if (page.data?.OGImage) {
        // Get image data from S3 image link
        return await this.getImageByImageLink({
          imageLink: getImageLinkFromAWS(page.data.OGImage.src),
        });
      } else {
        // If the URL doesn't exist in the Page table, create a new entry
        const newPage = await pageService.create({
          siteId: site.data.id,
          url,
        });

        if (!newPage.data || !newPage.data.OGImage) {
          return {
            message: newPage.message,
            status: newPage.status,
            data: null,
          };
        }

        // Get image data from S3 image link
        return await this.getImageByImageLink({
          imageLink: getImageLinkFromAWS(newPage.data.OGImage.src),
        });
      }
    } catch (error) {
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }

  private async getImageByImageLink({
    imageLink,
  }: IGetImageByImageLink): Promise<
    IResponse<IGetImageByImageLinkResponse | null>
  > {
    console.time("start fetch image from link S3");
    const response = await fetch(imageLink);
    console.timeEnd("start fetch image from link S3");

    if (!response.ok) {
      return {
        message: "Image not found",
        status: 404,
        data: null,
      };
    }

    const contentType = response.headers.get("content-type");
    const buffer = Buffer.from(await response.arrayBuffer());

    if (!contentType) {
      return {
        message: "Image not found",
        status: 404,
        data: null,
      };
    }

    return {
      message: "Image found",
      status: 200,
      data: {
        image: buffer,
        contentType,
      },
    };
  }
}

export const imageService = new ImageService();
