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
  async addFrame({ config, image }: AddFrameImage) {
    try {
      // Lấy template config dựa trên templateId
      const template = config;

      // Fetch background image từ CDN thay vì đọc từ local
      let backgroundBuffer: Buffer;
      if (template.frame.backgroundImage.startsWith("http")) {
        const response = await fetch(template.frame.backgroundImage);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch background image: ${response.statusText}`,
          );
        }
        backgroundBuffer = Buffer.from(await response.arrayBuffer());
      } else {
        throw new Error("Background image must be a URL");
      }

      const backgroundImage = sharp(backgroundBuffer).resize(
        template.frame.width,
        template.frame.height,
        {
          fit: "cover",
          position: "center",
        },
      );

      // Xử lý input image
      let imageBuffer: Buffer;

      if (typeof image === "string" && image.startsWith("http")) {
        // Nếu là URL, tải ảnh về
        const response = await fetch(image);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        imageBuffer = Buffer.from(await response.arrayBuffer());
      } else if (Buffer.isBuffer(image)) {
        // Nếu là Buffer, sử dụng trực tiếp
        imageBuffer = image;
      } else if (typeof image === "string") {
        // Nếu là local path
        imageBuffer = Buffer.from(image);
      } else {
        throw new Error("Invalid image input: must be URL string or Buffer");
      }

      const userImage = sharp(imageBuffer).resize(
        template.imagePlaceholder.width,
        template.imagePlaceholder.height,
        {
          fit: "cover",
          position: "top",
        },
      );

      // Kiểm tra nếu có bất kỳ border radius nào
      if (
        template.imagePlaceholder.borderRadius?.topLeft ||
        template.imagePlaceholder.borderRadius?.topRight ||
        template.imagePlaceholder.borderRadius?.bottomLeft ||
        template.imagePlaceholder.borderRadius?.bottomRight
      ) {
        // Lấy giá trị border radius cho từng góc
        const borderRadiusTopLeft =
          template.imagePlaceholder.borderRadius.topLeft || 0;
        const borderRadiusTopRight =
          template.imagePlaceholder.borderRadius.topRight || 0;
        const borderRadiusBottomLeft =
          template.imagePlaceholder.borderRadius.bottomLeft || 0;
        const borderRadiusBottomRight =
          template.imagePlaceholder.borderRadius.bottomRight || 0;

        // Tạo SVG với cả shadow và border radius
        const maskSVG = `
        <svg>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="${template.imagePlaceholder.shadow?.blur || 5}"/>
              <feOffset dx="${template.imagePlaceholder.shadow?.offsetX || 0}" dy="${template.imagePlaceholder.shadow?.offsetY || 5}" result="offsetblur"/>
              <feFlood flood-color="${template.imagePlaceholder.shadow?.color || "rgba(0,0,0,0.3)"}"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="
            M ${borderRadiusTopLeft} 0
            H ${template.imagePlaceholder.width - borderRadiusTopRight}
            Q ${template.imagePlaceholder.width} 0 ${template.imagePlaceholder.width} ${borderRadiusTopRight}
            V ${template.imagePlaceholder.height - borderRadiusBottomRight}
            Q ${template.imagePlaceholder.width} ${template.imagePlaceholder.height} ${template.imagePlaceholder.width - borderRadiusBottomRight} ${template.imagePlaceholder.height}
            H ${borderRadiusBottomLeft}
            Q 0 ${template.imagePlaceholder.height} 0 ${template.imagePlaceholder.height - borderRadiusBottomLeft}
            V ${borderRadiusTopLeft}
            Q 0 0 ${borderRadiusTopLeft} 0
            Z
          " fill="white" filter="url(#shadow)"/>
        </svg>`;

        userImage.composite([
          {
            input: Buffer.from(maskSVG),
            blend: "dest-in",
          },
        ]);
      }

      // Composite tất cả lại với nhau
      const finalImage = backgroundImage.composite([
        {
          input: await userImage.toBuffer(),
          top: template.imagePlaceholder.position.top,
          left: template.imagePlaceholder.position.left,
        },
      ]);

      // Optimize output
      return finalImage.webp({ quality: 100 }).toBuffer();
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
