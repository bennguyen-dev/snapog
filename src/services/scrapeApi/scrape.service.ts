import {
  IScrapeInternalLinks,
  IScrapeInternalLinksResponse,
  IScraperInfo,
  IScraperInfoResponse,
} from "@/services/scrapeApi/scrape.interface";
import { IResponse } from "@/types/global";

class ScrapeService {
  public async scrapeInfo({
    url,
  }: IScraperInfo): Promise<IResponse<IScraperInfoResponse | null>> {
    console.time(`Execute time scrape api get info for ${url}`);
    const apiUrl = `${process.env.SCRAPE_API_URL}/api/scrape-info`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch screenshot: ${res.status}`);
      }

      const data = (await res?.json()).data;

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: data.url,
          screenshot: data.screenshot
            ? Buffer.from(data.screenshot)
            : undefined,
          title: data.title,
          description: data.description || undefined,
          ogImage: data.ogImage,
        },
      };
    } catch (error) {
      console.error(`Error fetching info for ${url}:`, error);

      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Execute time scrape api get info for ${url}`);
    }
  }

  public async scrapeInternalLinks({
    url,
    limit,
  }: IScrapeInternalLinks): Promise<
    IResponse<IScrapeInternalLinksResponse | null>
  > {
    console.time(`Execute time scrape api get internal links for ${url}`);
    const apiUrl = `${process.env.SCRAPE_API_URL}/api/scrape-internal-links`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ url, limit }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch screenshot: ${res.status}`);
      }

      const data = (await res?.json()).data;

      return {
        status: 200,
        message: "Internal links fetched successfully",
        data: {
          links: data.links,
        },
      };
    } catch (error) {
      console.error(`Error fetching internal links for ${url}:`, error);

      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Execute time scrape api get internal links for ${url}`);
    }
  }
}

export const scrapeService = new ScrapeService();
