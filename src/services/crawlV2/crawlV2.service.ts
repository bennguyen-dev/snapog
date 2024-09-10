import { JSDOM } from "jsdom";

import { IResponse } from "@/lib/type";
import { getUrlWithProtocol } from "@/lib/utils";
import {
  ICrawlInfoOfUrl,
  ICrawlInfoOfUrlResponse,
  IGetInternalLinksOfDomain,
  IGetInternalLinksOfDomainResponse,
  IGetMetadataOfUrl,
  IGetMetadataOfUrlResponse,
  IScreenshotByScreenshotmachine,
} from "@/services/crawlV2";

class CrawlServiceV2 {
  public async crawlInfoByUrl({
    url,
    configScreenshot,
  }: ICrawlInfoOfUrl): Promise<IResponse<ICrawlInfoOfUrlResponse | null>> {
    console.time(`Crawl info of url: ${url}`);
    try {
      // Check if the URL is reachable by making a request
      const response = await fetch(getUrlWithProtocol(url), { method: "HEAD" });
      if (!response.ok) {
        return {
          status: response.status,
          message: `Error fetching the website ${url} - ${response.statusText}`,
          data: null,
        };
      }

      const metadata = await this.getMetadataOfUrl({ url });
      const screenShot = await this.screenshotByScreenshotMachine({
        url,
        config: configScreenshot,
      });
      return {
        status: 200,
        message: "Crawl info fetched successfully",
        data: {
          url,
          ...metadata.data,
          screenshot: screenShot,
        },
      };
    } catch (error) {
      console.error("Error fetching or parsing the website:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Crawl info of url: ${url}`);
    }
  }

  public async getInternalLinksOfDomain({
    domain,
    limit = Infinity,
  }: IGetInternalLinksOfDomain): Promise<
    IResponse<IGetInternalLinksOfDomainResponse | null>
  > {
    console.time(`Get internal links of domain: ${domain}`);
    try {
      const baseUrl = new URL(getUrlWithProtocol(domain));
      const response = await fetch(baseUrl.toString());
      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const uniqueLinks = new Set<string>();
      const linkElements = Array.from(doc.getElementsByTagName("a"));

      for (const element of linkElements) {
        if (uniqueLinks.size >= limit) break;

        const href = element.getAttribute("href");
        if (!href) continue;

        try {
          const linkUrl = new URL(href, baseUrl);
          if (
            linkUrl.hostname === baseUrl.hostname &&
            !this.isExcludedLink(href)
          ) {
            const normalizedUrl = this.normalizeUrl(linkUrl);
            uniqueLinks.add(normalizedUrl);
          }
        } catch (error) {
          console.error("Error processing link:", href, error);
        }
      }

      return {
        status: 200,
        message: "Internal links fetched successfully",
        data: {
          urls: Array.from(uniqueLinks),
        },
      };
    } catch (error) {
      console.error("Error fetching links:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Get internal links of domain: ${domain}`);
    }
  }

  private isExcludedLink(href: string): boolean {
    const excludedPrefixes = [
      "mailto:",
      "sms:",
      "skype:",
      "whatsapp:",
      "callto:",
      "viber:",
      "telegram:",
      "tel:",
      "#",
    ];
    return (
      excludedPrefixes.some((prefix) => href.startsWith(prefix)) ||
      href.includes("/api")
    );
  }

  private normalizeUrl(url: URL): string {
    let normalizedUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    normalizedUrl = normalizedUrl.replace(/\/$/, "");
    normalizedUrl = normalizedUrl.split("#")[0];
    normalizedUrl = normalizedUrl.split("?")[0];
    return normalizedUrl;
  }

  private async getMetadataOfUrl({
    url,
  }: IGetMetadataOfUrl): Promise<IResponse<IGetMetadataOfUrlResponse | null>> {
    console.time(`Get metadata of url: ${url}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch URL: ${response.status} ${response.statusText}`,
        );
      }
      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const baseUrl = new URL(url);

      const getMetaContent = (selector: string): string =>
        doc.querySelector(selector)?.getAttribute("content") || "";

      const getElementContent = (selector: string): string =>
        doc.querySelector(selector)?.textContent || "";

      const resolveUrl = (path: string): string =>
        path ? new URL(path, baseUrl).href : "";

      const metadata = {
        url,
        title: getElementContent("title"),
        description: getMetaContent('meta[name="description"]'),
        ogImage: resolveUrl(getMetaContent('meta[property="og:image"]')),
        favicon: resolveUrl(
          doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
            doc
              .querySelector('link[rel="shortcut icon"]')
              ?.getAttribute("href") ||
            "/favicon.ico",
        ),
      };

      return {
        status: 200,
        message: "Metadata fetched successfully",
        data: metadata,
      };
    } catch (error) {
      console.error("Error fetching or parsing the website:", error);
      return {
        status:
          error instanceof Error && "status" in error
            ? (error.status as number)
            : 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      console.timeEnd(`Get metadata of url: ${url}`);
    }
  }

  private async screenshotByScreenshotMachine({
    url,
    config,
  }: IScreenshotByScreenshotmachine): Promise<Buffer> {
    const defaultOptions = {
      device: "desktop",
      dimension: "1366x715",
      zoom: 100,
      format: "png",
      delay: 3000,
      "accept-language": "en-US,en;q=0.9",
      click:
        "[class*='close'],[class*='accept'],[class*='close'],[class*='accept'][class*='close-button'],[class*='close-icon'],[class*='close-btn'],[class*='close-button'],[class*='close-icon'],[class*='close-btn'],[class*='close-button'],[class*='close-icon'],[class*='close-btn'],[class*='close-button'],[class*='close-icon'],[class*='close-btn'],[class*='close-button'],[aria-label*='Close']", // click on the close button"
      hide: "[class*='cookie'],[class*='banner']", // hide the cookie banner
    };

    const params = new URLSearchParams({
      ...defaultOptions,
      ...config,
      url: url,
      key: process.env.SCREENSHOT_MACHINE_KEY,
    } as unknown as Record<string, string>);

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;

    try {
      console.time(`Execute screenshotmachine api for ${url}`);
      const res = await fetch(apiUrl);
      console.timeEnd(`Execute screenshotmachine api for ${url}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch screenshot: ${res.status}`);
      }

      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      console.error("Error fetching screenshot:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to fetch screenshot");
      }
    }
  }
}

export const crawlServiceV2 = new CrawlServiceV2();
