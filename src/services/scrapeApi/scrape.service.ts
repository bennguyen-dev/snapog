import {
  IScrapeInternalLinks,
  IScrapeInternalLinksResponse,
  IScraperInfo,
  IScraperInfoResponse,
} from "@/services/scrapeApi/scrape.interface";
import { IResponse } from "@/types/global";

class ScrapeService {
  /**
   * Get page info using Firecrawl for metadata and ScreenshotOne for screenshot
   */
  public async scrapeInfo({
    url,
  }: IScraperInfo): Promise<IResponse<IScraperInfoResponse | null>> {
    console.time(`Execute time scrape api get info for ${url}`);

    try {
      // Get metadata from HTML and screenshot from ScreenshotOne in parallel
      const [metadataResult, screenshotResult] = await Promise.allSettled([
        this.getMetadataFromHTML(url),
        this.getScreenshotFromScreenshotOne(url),
      ]);

      // Handle metadata result
      let metadata = null;
      if (metadataResult.status === "fulfilled" && metadataResult.value.data) {
        metadata = metadataResult.value.data;
      } else {
        console.error(
          "Failed to get metadata:",
          metadataResult.status === "rejected"
            ? metadataResult.reason
            : metadataResult.value.message,
        );
      }

      // Handle screenshot result
      let screenshot = null;
      if (
        screenshotResult.status === "fulfilled" &&
        screenshotResult.value.data
      ) {
        screenshot = screenshotResult.value.data;
      } else {
        console.error(
          "Failed to get screenshot:",
          screenshotResult.status === "rejected"
            ? screenshotResult.reason
            : screenshotResult.value.message,
        );
      }

      // If both metadata and screenshot failed, return error
      if (!metadata && !screenshot) {
        return {
          status: 500,
          message: "Failed to fetch both metadata and screenshot",
          data: null,
        };
      }

      if (!metadata) {
        console.warn(
          "Metadata failed but screenshot succeeded - continuing with screenshot only",
        );
      }

      // If screenshot failed but metadata succeeded, continue (screenshot is optional)
      if (!screenshot) {
        console.warn(
          "Screenshot failed but metadata succeeded - continuing without screenshot",
        );
      }

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: url,
          screenshot: screenshot || undefined,
          title: metadata?.title,
          description: metadata?.description,
          ogImage: metadata?.ogImage,
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

  /**
   * Get metadata by directly fetching HTML (no API cost)
   */
  private async getMetadataFromHTML(url: string): Promise<
    IResponse<{
      title?: string;
      description?: string;
      ogImage?: string;
    } | null>
  > {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SnapOG/1.0; +https://snapog.com)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Extract metadata from HTML
      const title = this.extractTitle(html);
      const description = this.extractDescription(html);
      const ogImage = this.extractOGImage(html, url);

      return {
        status: 200,
        message: "Metadata fetched successfully",
        data: {
          title,
          description,
          ogImage,
        },
      };
    } catch (error) {
      console.error("HTML fetch error:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Failed to fetch metadata",
        data: null,
      };
    }
  }

  /**
   * Extract title from HTML
   */
  private extractTitle(html: string): string | undefined {
    // Try og:title first
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogTitleMatch) {
      return this.decodeHtmlEntities(ogTitleMatch[1].trim());
    }

    // Try twitter:title
    const twitterTitleMatch = html.match(
      /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i,
    );
    if (twitterTitleMatch) {
      return this.decodeHtmlEntities(twitterTitleMatch[1].trim());
    }

    // Try regular title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      return this.decodeHtmlEntities(titleMatch[1].trim());
    }

    return undefined;
  }

  /**
   * Extract description from HTML
   */
  private extractDescription(html: string): string | undefined {
    // Try og:description first
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogDescMatch) {
      return this.decodeHtmlEntities(ogDescMatch[1].trim());
    }

    // Try twitter:description
    const twitterDescMatch = html.match(
      /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (twitterDescMatch) {
      return this.decodeHtmlEntities(twitterDescMatch[1].trim());
    }

    // Try regular description meta tag
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (descMatch) {
      return this.decodeHtmlEntities(descMatch[1].trim());
    }

    return undefined;
  }

  /**
   * Extract OG image from HTML
   */
  private extractOGImage(html: string, baseUrl: string): string | undefined {
    // Try og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogImageMatch) {
      return this.resolveUrl(ogImageMatch[1].trim(), baseUrl);
    }

    // Try twitter:image
    const twitterImageMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    );
    if (twitterImageMatch) {
      return this.resolveUrl(twitterImageMatch[1].trim(), baseUrl);
    }

    return undefined;
  }

  /**
   * Decode HTML entities
   */
  private decodeHtmlEntities(text: string): string {
    const entities: { [key: string]: string } = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&apos;": "'",
    };

    return text.replace(/&[#\w]+;/g, (entity) => {
      return entities[entity] || entity;
    });
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  private resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  /**
   * Get screenshot from ScreenshotOne API
   */
  private async getScreenshotFromScreenshotOne(
    url: string,
  ): Promise<IResponse<Buffer | null>> {
    try {
      const screenshotUrl = new URL("https://api.screenshotone.com/take");
      screenshotUrl.searchParams.set(
        "access_key",
        process.env.SCREENSHOTONE_ACCESS_KEY || "",
      );
      screenshotUrl.searchParams.set("url", url);
      screenshotUrl.searchParams.set("format", "png");
      screenshotUrl.searchParams.set("viewport_width", "1440");
      screenshotUrl.searchParams.set("viewport_height", "756");
      screenshotUrl.searchParams.set("device_scale_factor", "1");
      screenshotUrl.searchParams.set("full_page", "false");
      screenshotUrl.searchParams.set("block_ads", "true");
      screenshotUrl.searchParams.set("block_cookie_banners", "true");
      screenshotUrl.searchParams.set("delay", "3");

      const response = await fetch(screenshotUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "SnapOG/1.0 (+https://snapog.com)",
        },
      });

      if (!response.ok) {
        throw new Error(
          `ScreenshotOne API error: ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 100) {
        throw new Error("Screenshot data too small to be valid");
      }

      return {
        status: 200,
        message: "Screenshot captured successfully",
        data: buffer,
      };
    } catch (error) {
      console.error("ScreenshotOne error:", error);
      return {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : "Failed to capture screenshot",
        data: null,
      };
    }
  }

  /**
   * Get internal links using Firecrawl API
   */
  public async scrapeInternalLinks({
    url,
    limit,
  }: IScrapeInternalLinks): Promise<
    IResponse<IScrapeInternalLinksResponse | null>
  > {
    console.time(`Execute time scrape api get internal links for ${url}`);

    try {
      const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          onlyMainContent: true,
          parsers: [],
          maxAge: 172800000, // 2 days cache
          formats: ["links"],
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            status: 404,
            message: "Page not found",
            data: null,
          };
        }
        throw new Error(
          `Firecrawl API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Firecrawl failed: ${data.error || "Unknown error"}`);
      }

      // Extract links from the response (v2 API structure)
      const links: string[] = data.data?.links || [];

      return {
        status: 200,
        message: "Internal links fetched successfully",
        data: {
          links: links.slice(0, limit),
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
