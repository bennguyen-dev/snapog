import { IGetDemo, IGetDemoResponse } from "@/sevices/demo";
import { crawlService } from "@/sevices/crawl";
import { IResponse } from "@/lib/type";

class DemoService {
  async getDemo({
    domain,
    numberOfImages = 3,
  }: IGetDemo): Promise<IResponse<IGetDemoResponse[] | null>> {
    try {
      const urls = await crawlService.getAllUrlByDomain({
        domain,
        limit: numberOfImages,
      });

      if (!urls.data) {
        return {
          status: urls.status,
          message: urls.message,
          data: null,
        };
      }

      // Generate screenshots for each page concurrently
      const urlsInfoPromises = urls.data?.urls.map((url) =>
        crawlService.getInfoByUrl({ url }),
      );
      const urlsInfo = await Promise.all(urlsInfoPromises);

      const results: IGetDemoResponse[] = [];

      // Filter out null values (in case of errors during screenshot generation)
      urlsInfo.forEach((result) => {
        if (result.data && result.data.screenShot) {
          const { url, ogImage, title, description, screenShot } = result.data;

          results.push({
            url,
            smartOgImageBase64: `data:image/png;base64,${screenShot.toString("base64")}`,
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
    }
  }
}

export const demoService = new DemoService();
