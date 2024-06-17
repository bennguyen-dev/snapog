import { prisma } from "@/lib/db";
import { crawlService } from "@/sevices/crawl";
import { storageService } from "@/sevices/storage";
import { IMAGE_TYPES } from "@/lib/constants";
import { sanitizeFilename } from "@/lib/utils";

class CronService {
  async updateOGImage() {
    console.log("Running daily update OG Image");
    const today = new Date();

    try {
      const ogImages = await prisma.oGImage.findMany({
        where: {
          expiresAt: {
            lte: today,
          },
        },
        include: {
          pages: {
            include: {
              site: true,
            },
          },
        },
      });

      if (!ogImages) {
        return {
          message: "No OG Image found",
          status: 404,
          data: null,
        };
      }

      console.log(
        `found ${ogImages.length} need to update on ${today.toISOString()}`,
        ogImages,
      );

      for (const ogImage of ogImages) {
        const pages = ogImage.pages;

        console.log("pages need to update", pages);
        if (!pages) {
          continue;
        }

        for (const page of pages) {
          if (!page) {
            continue;
          }
          const cacheDurationDays = page.cacheDurationDays ?? 0;

          // fetch new image
          console.log(`fetch new image ${page.url}`);
          const pageCrawlInfo = await crawlService.getInfoByUrl({
            url: page.url,
          });
          console.log(`end fetch new image ${page.url}`, pageCrawlInfo);

          if (!pageCrawlInfo.data) {
            continue;
          }

          // Upload screenshot to S3
          console.log(
            `upload image ${page.url}`,
            pageCrawlInfo.data?.screenShot,
          );
          const uploadRes = await storageService.uploadImage({
            image: pageCrawlInfo.data?.screenShot,
            type: IMAGE_TYPES.PNG,
            fileName: sanitizeFilename(page.url),
            folder: sanitizeFilename(page.site.domain),
          });
          console.log(`end upload image ${page.url}`, uploadRes);

          if (!uploadRes.data) {
            continue;
          }

          const newExpiresAt = new Date(today);
          newExpiresAt.setDate(today.getDate() + cacheDurationDays);

          // update og image
          console.log(`update og image ${page.url}`);
          await prisma.oGImage.update({
            where: {
              id: ogImage.id,
            },
            data: {
              src: uploadRes.data.src,
              expiresAt: newExpiresAt,
              updatedAt: new Date(),
            },
          });
          console.log(`end update og image ${page.url}`, uploadRes);
        }
      }

      console.log("OG Image updated successfully");
      return {
        message: "OG Image updated successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }
}

export const cronService = new CronService();
