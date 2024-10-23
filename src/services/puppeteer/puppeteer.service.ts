import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import puppeteer, { Browser, Page } from "puppeteer";

import { IResponse } from "@/lib/type";
import { getUrlWithProtocol } from "@/lib/utils";
import { IGetInfo, IGetInfoResponse } from "@/services/puppeteer";

class PuppeteerService {
  public async getInfo({
    url,
  }: IGetInfo): Promise<IResponse<IGetInfoResponse | null>> {
    console.time(`Total execution time crawl info for url: ${url}`);

    const urlWithProtocol = getUrlWithProtocol(url);
    const host = new URL(urlWithProtocol).host;

    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      const blocker = await PuppeteerBlocker.fromLists(fetch, [
        "https://secure.fanboy.co.nz/fanboy-cookiemonster.txt",
      ]);

      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--hide-scrollbars",
          "--disable-web-security",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
        defaultViewport: {
          width: 1440,
          height: 756,
        },
      });

      if (!browser) {
        throw new Error("Failed to launch browser");
      }

      page = await browser.newPage();

      if (!page) {
        throw new Error("Failed to create new page");
      }

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.3",
      );

      await blocker.enableBlockingInPage(page);

      const response = await page.goto(urlWithProtocol, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      if (!response || !response.ok()) {
        throw new Error("Failed to load page");
      }

      const bodyContentExist = await page.evaluate(() => {
        return document.body && document.body.innerHTML.trim().length > 0;
      });

      if (!bodyContentExist) {
        throw new Error(`No body content found on page: ${url}`);
      }

      const screenshot = await page
        .screenshot({
          optimizeForSpeed: true,
          fullPage: false,
          encoding: "binary",
          type: "png",
        })
        .catch(() => {
          return undefined;
        });

      const title = await page.title().catch(() => {
        return undefined;
      });
      const description = await page
        .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
        .catch(() => {
          return undefined;
        });
      const ogImage = await page
        .$eval('meta[property="og:image"]', (el) => el.getAttribute("content"))
        .catch(() => {
          return undefined;
        });

      const absoluteOgImage =
        ogImage && ogImage.startsWith("http")
          ? ogImage
          : `https://${host}${ogImage}`;

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: urlWithProtocol,
          screenshot: screenshot ? Buffer.from(screenshot) : undefined,
          title,
          description: description || undefined,
          ogImage: absoluteOgImage,
        },
      };
    } catch (error) {
      console.error("Error generating page info:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      try {
        if (page && !page.isClosed()) {
          await page.close();
        }
        if (browser) {
          await browser.close();
        }
      } catch (closeError) {
        console.error("Error closing browser/page:", closeError);
      }
      console.timeEnd(`Total execution time crawl info for url: ${url}`);
    }
  }
}

export const puppeteerService = new PuppeteerService();
