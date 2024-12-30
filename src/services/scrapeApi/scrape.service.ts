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
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 45000); // 45 seconds timeout

    try {
      const params = new URLSearchParams({ url });
      const res = await fetch(`${apiUrl}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 5 * 60, // 5 minutes
        },
        signal: controller.signal,
      });

      if (res.status === 400) {
        return {
          status: 400,
          message: (await res.json()).message,
          data: null,
        };
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch page info: ${res.status}`);
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

      if (error instanceof Error && error.name === "AbortError") {
        return {
          status: 408,
          message: "Request timeout - operation took longer than 45 seconds",
          data: null,
        };
      }

      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      clearTimeout(timeout);
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

    const params = new URLSearchParams({ url });
    if (limit) {
      params.append("limit", limit.toString());
    }

    try {
      const res = await fetch(`${apiUrl}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 5 * 60, // 5 minutes
        },
      });

      if (res.status === 404) {
        return {
          status: 404,
          message: "Page not found",
          data: null,
        };
      }

      if (!res.ok) {
        throw new Error(`Failed to get internal links`);
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
