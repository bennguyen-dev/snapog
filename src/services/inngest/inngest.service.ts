import { prisma } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { crawlServiceV2 } from "@/services/crawlV2";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { storageService } from "@/services/storage";

class InngestService {
  public backgroundCreateSite = inngest.createFunction(
    { id: "background/create.site", name: "Background Create Site" },
    { event: "background/create.site" },
    async ({ event, step }) => {
      return await step.run("Process Site and Create Pages", async () => {
        try {
          // Get site
          const site = await siteService.getBy({ id: event.data.siteId });
          if (!site || !site.data) {
            console.log(`No site found for id: ${event.data.siteId}`);
            return { status: "error", message: "Site not found" };
          }

          // Get internal links
          const urlsResult = await crawlServiceV2.getInternalLinksOfDomain({
            domain: site.data.domain as string,
            limit: 3, // TODO: make it configurable later when user has pricing
          });
          if (
            !urlsResult ||
            !urlsResult.data ||
            !urlsResult.data.urls ||
            urlsResult.data.urls.length === 0
          ) {
            console.log(`No URLs found for domain: ${site.data.domain}`);
            return { status: "error", message: "No URLs found" };
          }

          // Create pages
          const pageCreationPromises = urlsResult.data.urls.map((link) =>
            pageService.create({
              siteId: site.data?.id as string,
              url: link,
            }),
          );

          const results = await Promise.allSettled(pageCreationPromises);

          const summary = results.reduce<{
            succeeded: string[];
            failed: { url: string; error: string }[];
          }>(
            (acc, result, index) => {
              if (result.status === "fulfilled") {
                acc.succeeded.push(urlsResult.data?.urls?.[index] as string);
              } else {
                acc.failed.push({
                  url: urlsResult.data?.urls?.[index] as string,
                  error: result.reason,
                });
                console.error(
                  `Failed to create page for ${urlsResult.data?.urls?.[index]}:`,
                  result.reason,
                );
              }
              return acc;
            },
            { succeeded: [], failed: [] },
          );

          return {
            status: "success",
            message: "Site processing complete",
            summary,
          };
        } catch (error) {
          console.error("Error in background site creation:", error);
          return { status: "error", message: "Internal processing error" };
        }
      });
    },
  );

  public scheduleUpdateOGImageDaily = inngest.createFunction(
    { id: "schedule/update.ogimage.daily", name: "Update OG Image Daily" },
    { cron: "0 0 * * *" },
    async ({ step }) => {
      const today = new Date();

      // Step 1: Fetch expired OG Images
      const { ogImages } = await step.run(
        "Fetch expired OG Images",
        async () => {
          console.log("Fetching expired OG Images");
          const ogImages = await prisma.oGImage.findMany({
            where: {
              expiresAt: {
                lte: today,
              },
            },
            include: {
              pages: true,
            },
          });

          console.log(
            `Found ${ogImages.length} images to update on ${today.toISOString()}`,
          );
          return { ogImages };
        },
      );

      if (ogImages.length === 0) {
        return {
          message: "No OG Images found to update",
          status: 200,
          data: null,
        };
      }

      // Step 2: Process and update OG Images
      return await step.run("Process and update OG Images", async () => {
        const updatePromises = ogImages.flatMap((ogImage) =>
          ogImage.pages.map(async (page) => {
            if (!page) return;

            const cacheDurationDays = page.cacheDurationDays ?? 0;

            console.log(`Processing page: ${page.url}`);
            const pageCrawlInfo = await crawlServiceV2.crawlInfoByUrl({
              url: page.url,
              configScreenshot: {
                cacheLimit: 0,
              },
            });

            if (!pageCrawlInfo.data?.screenshot) {
              console.log(`No screenshot available for ${page.url}`);
              return;
            }

            const uploadRes = await storageService.uploadImage({
              image: pageCrawlInfo.data.screenshot,
              key: ogImage.src,
            });

            if (!uploadRes.data) {
              console.log(`Failed to upload image for ${page.url}`);
              return;
            }

            const newExpiresAt = new Date(
              today.getTime() + cacheDurationDays * 24 * 60 * 60 * 1000,
            );

            return prisma.oGImage.update({
              where: { id: ogImage.id },
              data: {
                src: uploadRes.data.src,
                expiresAt: newExpiresAt,
                updatedAt: new Date(),
              },
            });
          }),
        );

        const results = await Promise.allSettled(updatePromises);

        const summary = results.reduce<{
          succeeded: string[];
          failed: { url: string; error: string }[];
        }>(
          (acc, result, index) => {
            if (result.status === "fulfilled") {
              acc.succeeded.push(ogImages?.[index]?.pages?.[0]?.url as string);
            } else {
              acc.failed.push({
                url: ogImages?.[index]?.pages?.[0]?.url as string,
                error: result.reason,
              });
              console.error(
                `Failed to create page for ${ogImages?.[index]?.pages?.[0]?.url}:`,
                result.reason,
              );
            }
            return acc;
          },
          { succeeded: [], failed: [] },
        );

        console.log("OG Images updated successfully");
        return {
          status: "success",
          message: "Site processing complete",
          summary,
        };
      });
    },
  );
}

export const inngestService = new InngestService();
