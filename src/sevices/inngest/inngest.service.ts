import { inngest } from "@/lib/inngest";
import { crawlService } from "@/sevices/crawl";
import { pageService } from "@/sevices/page";
import { siteService } from "@/sevices/site";

class InngestService {
  public processCreateSite = inngest.createFunction(
    { id: "event/create.pages" },
    { event: "event/create.pages" },
    async ({ event, step }) => {
      const site = await step.run(
        `getSiteById ${event.data.siteId}`,
        async () => siteService.getBy({ id: event.data.siteId }),
      );
      if (!site || !site.data) {
        return;
      }

      const urls = await step.run(
        `getUrlByDomain ${site.data.domain}`,
        async () =>
          crawlService.searchSiteLinks({
            domain: site.data?.domain as string,
            limit: 20,
          }),
      );

      if (!urls || !urls.data) {
        return;
      }

      const operations = urls.data?.urls.map(async (link) => {
        if (site.data?.id && link) {
          return await step.run(`pageCreate ${link}`, async () =>
            pageService.create({
              siteId: site.data?.id as string,
              url: link,
            }),
          );
        }
      });

      const results = await Promise.allSettled(operations);

      return results.filter((result) => {
        if (result.status === "rejected") {
          console.error(result.reason);
        }
        return result.status === "fulfilled";
      });
    },
  );
}

export const inngestService = new InngestService();
