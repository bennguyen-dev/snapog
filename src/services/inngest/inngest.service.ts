import { prisma } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { pageService } from "@/services/page";
import { scrapeService } from "@/services/scrapeApi";
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
            console.error(`No site found for id: ${event.data.siteId}`);
            return { status: "error", message: "Site not found" };
          }

          // Get internal links
          const urlsResult = await scrapeService.scrapeInternalLinks({
            url: site.data.domain as string,
            limit: 3, // TODO: make it configurable later when user has pricing
          });
          if (
            !urlsResult ||
            !urlsResult.data ||
            !urlsResult.data.links ||
            urlsResult.data.links.length === 0
          ) {
            console.error(`No URLs found for domain: ${site.data.domain}`);
            return { status: "error", message: "No URLs found" };
          }

          // Create pages
          const pageCreationPromises = urlsResult.data.links.map((link) =>
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
                acc.succeeded.push(urlsResult.data?.links?.[index] as string);
              } else {
                acc.failed.push({
                  url: urlsResult.data?.links?.[index] as string,
                  error: result.reason,
                });
                console.error(
                  `Failed to create page for ${urlsResult.data?.links?.[index]}:`,
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
      const { pages } = await step.run("Fetch expired OG Images", async () => {
        console.log("Fetching expired OG Images");
        const pages = await prisma.page.findMany({
          where: {
            imageExpiresAt: {
              lte: today,
            },
          },
        });

        console.log(
          `Found ${pages.length} images to update on ${today.toISOString()}`,
        );
        return { pages };
      });

      if (pages.length === 0) {
        return {
          message: "No OG Images found to update",
          status: 200,
          data: null,
        };
      }

      // Step 2: Process and update OG Images
      return await step.run("Process and update OG Images", async () => {
        const updatePromises = pages.map(async (page) => {
          if (!page || !page.imageSrc) return;

          const cacheDurationDays = page.cacheDurationDays ?? 0;

          console.log(`Processing page: ${page.url}`);
          const pageCrawlInfo = await scrapeService.scrapeInfo({
            url: page.url,
          });

          if (!pageCrawlInfo.data?.screenshot) {
            console.error(`No screenshot available for ${page.url}`);
            return;
          }

          const uploadRes = await storageService.uploadImage({
            image: pageCrawlInfo.data.screenshot,
            key: page.imageSrc,
          });

          if (!uploadRes.data) {
            console.error(`Failed to upload image for ${page.url}`);
            return;
          }

          const newExpiresAt = new Date(
            today.getTime() + cacheDurationDays * 24 * 60 * 60 * 1000,
          );

          return prisma.page.update({
            where: { id: page.id },
            data: {
              imageSrc: uploadRes.data.src,
              imageExpiresAt: newExpiresAt,
              updatedAt: new Date(),
            },
          });
        });

        const results = await Promise.allSettled(updatePromises);

        const summary = results.reduce<{
          succeeded: string[];
          failed: { url: string; error: string }[];
        }>(
          (acc, result, index) => {
            if (result.status === "fulfilled") {
              acc.succeeded.push(pages?.[index]?.url as string);
            } else {
              acc.failed.push({
                url: pages?.[index]?.url as string,
                error: result.reason,
              });
              console.error(
                `Failed to create page for ${pages?.[index]?.url}:`,
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
