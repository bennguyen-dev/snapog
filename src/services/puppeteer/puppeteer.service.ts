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
      console.time(`Blocker for url: ${url}`);
      const blocker = await PuppeteerBlocker.fromLists(fetch, [
        "https://secure.fanboy.co.nz/fanboy-cookiemonster.txt",
      ]);
      console.timeEnd(`Blocker for url: ${url}`);

      console.time(`Launching browser for url: ${url}`);
      browser = await puppeteer.launch({
        defaultViewport: { width: 2400, height: 1280, deviceScaleFactor: 2 },
        headless: true,
        args: [
          "--hide-scrollbars",
          "--disable-web-security",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-software-rasterizer",
          // Set window size to match desired screenshot size
          "--window-size=2400,1280",
        ],
      });
      console.timeEnd(`Launching browser for url: ${url}`);

      if (!browser) {
        throw new Error("Failed to launch browser");
      }

      page = await browser.newPage();

      if (!page) {
        throw new Error("Failed to create new page");
      }

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      );

      await blocker.enableBlockingInPage(page);

      const response = await page.goto(urlWithProtocol, {
        waitUntil: "domcontentloaded",
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

      // Reduced wait time and added error handling
      // await page.waitForTimeout(1000);

      const [screenshot, title, description, ogImage] = await Promise.all([
        page
          .screenshot({
            optimizeForSpeed: true,
            omitBackground: true,
            path: "screenshot.png",
          })
          .catch(() => null),
        page.title().catch(() => undefined),
        page
          .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
          .catch(() => undefined),
        page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute("content"),
          )
          .catch(() => undefined),
      ]);

      // Convert ogImage to absolute URL if it's relative
      const absoluteOgImage =
        ogImage && typeof ogImage === "string"
          ? ogImage.startsWith("http")
            ? ogImage
            : `https://${host}${ogImage}`
          : undefined;

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: urlWithProtocol,
          // screenshot,
          title,
          description,
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
