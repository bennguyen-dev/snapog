import { IResponse } from "@/lib/type";
import { crawlServiceV2 } from "@/sevices/crawlV2";
import { IGetDemo, IGetDemoResponse } from "@/sevices/demo";

class DemoService {
  async getDemo({
    domain,
    numberOfImages = 3,
  }: IGetDemo): Promise<IResponse<IGetDemoResponse[] | null>> {
    console.time(`Get demo for domain: ${domain}`);
    try {
      const urls = await crawlServiceV2.getInternalLinksOfDomain({
        domain,
        limit: numberOfImages,
      });

      console.log("urls 😋", { urls }, "");

      if (!urls.data) {
        return {
          status: urls.status,
          message: urls.message,
          data: null,
        };
      }

      // Generate screenshots for each page concurrently
      const urlsInfoPromises = urls.data?.urls.map((url) =>
        crawlServiceV2.crawlInfoByUrl({ url }),
      );
      const urlsInfo = await Promise.all(urlsInfoPromises);

      const results: IGetDemoResponse[] = [];

      // Filter out null values (in case of errors during screenshot generation)
      urlsInfo.forEach((result) => {
        if (result.data && result.data.screenshot) {
          const { url, ogImage, title, description, screenshot } = result.data;

          results.push({
            url,
            smartOgImageBase64: `data:image/png;base64,${screenshot.toString("base64")}`,
            title,
            description,
            ogImage,
          });
        }
      });

      return {
        status: 200,
        message: "Generated OG images successfully",
        data: results,
      };
    } catch (error) {
      console.error("Error generating OG images for domain:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Get demo for domain: ${domain}`);
    }
  }
}

export const demoService = new DemoService();
