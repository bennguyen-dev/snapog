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
} from "@/sevices/crawlV2";

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

      const linkElements = Array.from(doc.getElementsByTagName("a"));
      const uniqueLinks = new Set<string>();

      for (const element of linkElements) {
        if (uniqueLinks.size >= limit) break;

        const href = element.getAttribute("href");
        if (href) {
          try {
            const linkUrl = new URL(href, baseUrl);

            // Check if it's an internal link and not a mailto
            if (
              linkUrl.hostname === baseUrl.hostname &&
              !href.startsWith("mailto:") &&
              !href.startsWith("sms:") &&
              !href.startsWith("skype:") &&
              !href.startsWith("whatsapp:") &&
              !href.startsWith("callto:") &&
              !href.startsWith("viber:") &&
              !href.startsWith("telegram:") &&
              !href.startsWith("tel:") &&
              !href.startsWith("#") &&
              !href.includes("/api")
            ) {
              // Normalize the URL
              let normalizedUrl = `${linkUrl.protocol}//${linkUrl.hostname}${linkUrl.pathname}`;
              normalizedUrl = normalizedUrl.replace(/\/$/, ""); // Remove trailing slash
              normalizedUrl = normalizedUrl.split("#")[0]; // Remove hash
              normalizedUrl = normalizedUrl.split("?")[0]; // Remove search string

              uniqueLinks.add(normalizedUrl);
            }
          } catch (error) {
            console.error("Error processing link:", href, error);
          }
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

  private async getMetadataOfUrl({
    url,
  }: IGetMetadataOfUrl): Promise<IResponse<IGetMetadataOfUrlResponse | null>> {
    console.time(`Get metadata of url: ${url}`);
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const baseUrl = new URL(url);

      const title = doc.querySelector("title")?.textContent || "";
      const description =
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";

      let ogImage =
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") || "";
      if (ogImage && !ogImage.startsWith("http")) {
        ogImage = new URL(ogImage, baseUrl).href;
      }

      let favicon =
        doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
        doc.querySelector('link[rel="shortcut icon"]')?.getAttribute("href") ||
        "/favicon.ico";
      favicon = new URL(favicon, baseUrl).href;

      return {
        status: 200,
        message: "Metadata fetched successfully",
        data: {
          url,
          title,
          description,
          ogImage,
          favicon,
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
