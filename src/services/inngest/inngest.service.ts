import { inngest } from "@/lib/inngest";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { getUrlWithProtocol } from "@/utils";

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

          const homepageUrl = getUrlWithProtocol(site.data.domain as string);
          const page = await pageService.create({
            siteId: site.data.id,
            url: homepageUrl,
          });

          if (!page.data) {
            console.error(
              `Failed to create homepage for ${site.data.domain}:`,
              page.message,
            );
            return { status: "error", message: page.message };
          }

          return {
            status: "success",
            message: "Homepage created successfully",
            page: page.data,
          };
        } catch (error) {
          console.error("Error in background site creation:", error);
          return { status: "error", message: "Internal processing error" };
        }
      });
    },
  );
}

export const inngestService = new InngestService();
