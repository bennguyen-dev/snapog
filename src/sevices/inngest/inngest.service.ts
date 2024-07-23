import { inngest } from "@/lib/inngest";
import { crawlService } from "@/sevices/crawl";
import { pageService } from "@/sevices/page";
import { siteService } from "@/sevices/site";

class InngestService {
  public backgroundCreateSite = inngest.createFunction(
    { id: "background/create.site" },
    { event: "background/create.site" },
    async ({ event, step }) => {
      const site = await step.run(
        `Get site by id: ${event.data.siteId}`,
        async () => siteService.getBy({ id: event.data.siteId }),
      );
      if (!site || !site.data) {
        return;
      }

      const urls = await step.run(
        `Get internal links by domain: ${site.data.domain} - limit: 20`,
        async () =>
          crawlService.getLinksByDomain({
            domain: site.data?.domain as string,
            limit: 3,
          }),
      );

      if (!urls || !urls.data) {
        return;
      }

      const operations = urls.data?.urls.map(async (link) => {
        if (site.data?.id && link) {
          return await step.run(`Create page for url: ${link}`, async () =>
            pageService.create({
              siteId: site.data?.id as string,
              url: link,
            }),
          );
        }
      });

      const results = await Promise.allSettled(operations);

      return results.map((result) => {
        if (result.status === "rejected") {
          console.error(result.reason);
        }
        return result;
      });
    },
  );
}

export const inngestService = new InngestService();
