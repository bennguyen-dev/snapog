import { IResponse } from "@/lib/type";
import {
  getDomainName,
  getImageLinkFromAWS,
  getUrlWithoutProtocol,
} from "@/lib/utils";
import {
  IGenerateOGImage,
  IGenerateOGImageResponse,
  IGetImageByImageLink,
  IGetImageByImageLinkResponse,
} from "@/services/image";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { userService } from "@/services/user";

class ImageService {
  async generateOGImage({
    url,
    apiKey,
  }: IGenerateOGImage): Promise<IResponse<IGenerateOGImageResponse | null>> {
    const domain = getDomainName(url);

    try {
      // Check exists api key
      const userRes = await userService.getUser({ apiKey });

      if (!userRes.data) {
        return {
          message: userRes.message,
          status: userRes.status,
          data: null,
        };
      }

      // Check if the domain exists in the Site table
      const site = await siteService.getBy({ domain, userId: userRes.data.id });

      if (!site.data) {
        return {
          message: site.message,
          status: site.status,
          data: null,
        };
      }

      // Check if the URL exists in the Page table for this site
      const page = await pageService.getBy({
        url: getUrlWithoutProtocol(url),
        siteId: site.data.id,
      });

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
      console.error(`Error while getting image by url ${url}: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  private async getImageByImageLink({
    imageLink,
  }: IGetImageByImageLink): Promise<
    IResponse<IGetImageByImageLinkResponse | null>
  > {
    try {
      const response = await fetch(imageLink, {
        cache: "no-store",
        headers: {
          Accept: "image/*",
          "User-Agent":
            "Mozilla/5.0 (compatible; SnapOG/1.0; +https://www.snapog.com)",
        },
      });

      if (!response.ok) {
        console.error(
          `Image fetch failed: ${response.status} ${response.statusText}`,
        );
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        console.error(`Invalid content type: ${contentType}`);
        throw new Error("Invalid content type");
      }

      const arrayBuffer = await response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("Empty image buffer received");
      }

      const buffer = Buffer.from(arrayBuffer);

      // Additional validation
      if (buffer.length < 100) {
        // Arbitrary minimum size for a valid image
        throw new Error("Image data too small to be valid");
      }

      return {
        message: "Image found",
        status: 200,
        data: {
          image: buffer,
          contentType,
          size: buffer.length,
        },
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      return {
        message:
          error instanceof Error ? error.message : "Failed to fetch image",
        status: 500,
        data: null,
      };
    }
  }
}

export const imageService = new ImageService();
