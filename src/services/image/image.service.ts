import sharp from "sharp";

import {
  AddFrameImage,
  IGenerateOGImage,
  IGenerateOGImageResponse,
  IGetImageByImageLink,
  IGetImageByImageLinkResponse,
} from "@/services/image";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { userService } from "@/services/user";
import { IResponse } from "@/types/global";
import {
  getDomainName,
  getImageLinkFromAWS,
  getUrlWithoutProtocol,
} from "@/utils";

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

      if (page.data?.imageSrc) {
        // Get image data from S3 image link
        return await this.getImageByImageLink({
          imageLink: getImageLinkFromAWS(page.data.imageSrc),
        });
      } else {
        // If the URL doesn't exist in the Page table, create a new entry
        const newPage = await pageService.create({
          siteId: site.data.id,
          url,
        });

        if (!newPage.data || !newPage.data.imageSrc) {
          return {
            message: newPage.message,
            status: newPage.status,
            data: null,
          };
        }

        // Get image data from S3 image link
        return await this.getImageByImageLink({
          imageLink: getImageLinkFromAWS(newPage.data.imageSrc),
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

  // Add frame
  async addFrame({ config, image, text }: AddFrameImage) {
    try {
      // Lấy template config dựa trên templateId
      const template = config;

      // Đọc background image của template
      const backgroundImage = sharp(
        `${process.cwd()}/src/assets/${template.frame.backgroundImage}`,
      ).resize(template.frame.width, template.frame.height, {
        fit: "cover",
        position: "center",
      });

      // Xử lý input image
      const userImage = sharp(image).resize(
        template.imagePlaceholder.width,
        template.imagePlaceholder.height,
        {
          fit: "cover",
          position: "center",
        },
      );

      if (template.imagePlaceholder.borderRadius > 0) {
        userImage.composite([
          {
            input: Buffer.from(`
          <svg>
            <rect 
              x="0" 
              y="0" 
              width="${template.imagePlaceholder.width}" 
              height="${template.imagePlaceholder.height}" 
              rx="${template.imagePlaceholder.borderRadius}" 
              ry="${template.imagePlaceholder.borderRadius}"
            />
          </svg>`),
            blend: "dest-in",
          },
        ]);
      }

      // Tạo SVG cho text
      const textSVG = `
      <svg width="${template.frame.width}" height="${template.frame.height}">
        ${
          text?.title
            ? `
          <text 
            x="${template.text.title.position.left}" 
            y="${template.text.title.position.top}"
            font-size="${template.text.title.fontSize}px"
            fill="${template.text.title.color}"
          >${text.title}</text>
        `
            : ""
        }
        ${
          text?.description
            ? `
          <text 
            x="${template.text.description.position.left}" 
            y="${template.text.description.position.top}"
            font-size="${template.text.description.fontSize}px"
            fill="${template.text.description.color}"
          >${text.description}</text>
        `
            : ""
        }
      </svg>
    `;

      // Composite tất cả lại với nhau
      const finalImage = backgroundImage.composite([
        {
          input: await userImage.toBuffer(),
          top: template.imagePlaceholder.position.top,
          left: template.imagePlaceholder.position.left,
        },
        {
          input: Buffer.from(textSVG),
          top: 0,
          left: 0,
        },
      ]);

      // Optimize output
      return finalImage.jpeg({ quality: 85, progressive: true }).toBuffer();
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
