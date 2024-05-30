import {
  IGetAllUrlByDomain,
  IGetAllUrlByDomainResponse,
  IGetInfoByUrl,
  IGetInfoByUrlResponse,
} from "@/sevices/crawl";
import { getUrlWithProtocol } from "@/lib/utils";
import puppeteer from "puppeteer-core";
import { IResponse } from "@/lib/type";

import chromium from "@sparticuz/chromium-min";
import { PRIORITY_PAGES } from "@/lib/constants";

class CrawlService {
  async getInfoByUrl({
    url,
  }: IGetInfoByUrl): Promise<IResponse<IGetInfoByUrlResponse | null>> {
    const verifiedUrl = getUrlWithProtocol(url);

    const browser = await puppeteer.launch({
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
        "--disable-dev-shm-usage",
      ],
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`,
      ),
      ignoreHTTPSErrors: true,
      headless: true,
    });

    try {
      const page = await browser.newPage();

      // Set viewport size
      await page.setViewport({ width: 1280, height: 800 });

      const response = await page.goto(verifiedUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      }); // Set timeout to 60 seconds

      // Check if the response status is okay (2xx or 3xx)
      if (!response || !response.ok()) {
        console.error(`Error loading page: ${url}`);
        await browser.close();
        return {
          status: 500,
          message: `Error loading page: ${url}`,
          data: null,
        };
      }

      // Check for UI elements on the page (optional)
      const bodyContentExist = await page.evaluate(() => {
        // Check if the body contains any content
        return document.body && document.body.innerHTML.trim().length > 0;
      });

      if (!bodyContentExist) {
        console.error(`No body content found on page: ${url}`);
        await browser.close();
        return {
          status: 500,
          message: `No body content found on page: ${url}`,
          data: null,
        };
      }

      // Capture screenshot
      const screenshot = await page.screenshot();

      // Get title and description, og:image
      const title = await page.title();
      const description = await page.evaluate(() => {
        const metaDescription = document.querySelector(
          'meta[name="description"]',
        );
        return metaDescription ? metaDescription.getAttribute("content") : "";
      });

      const image = await page.evaluate(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        return ogImage ? ogImage.getAttribute("content") : null;
      });

      // Close page and browser after capturing screenshot
      await page.close();
      await browser.close();

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: verifiedUrl,
          screenShot: screenshot,
          title,
          description: description || undefined,
          ogImage: image || undefined,
        },
      };
    } catch (error) {
      console.error("Error generating OG image:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    } finally {
      await browser.close();
    }
  }

  async getAllUrlByDomain({
    domain,
    limit = 4,
  }: IGetAllUrlByDomain): Promise<
    IResponse<IGetAllUrlByDomainResponse | null>
  > {
    const homepage = getUrlWithProtocol(domain);

    const browser = await puppeteer.launch({
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
        "--disable-dev-shm-usage",
      ],
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`,
      ),
      ignoreHTTPSErrors: true,
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(homepage, { waitUntil: "networkidle2", timeout: 30000 });

      // Get all links and check if they contain any priority page keyword
      const links = await page.evaluate(
        (priorityPages, homepage) => {
          const anchorElements = document.querySelectorAll("a");
          const uniqueLinks = new Set<string>();

          // Add the homepage URL to the set
          uniqueLinks.add(homepage.toString());

          // Process anchor elements
          anchorElements.forEach((anchor) => {
            const url = new URL(anchor.href);
            url.search = ""; // Remove the query string

            // Check if the URL contains any priority page keyword
            for (const keyword of priorityPages) {
              if (url.toString().includes(keyword)) {
                uniqueLinks.add(url.toString());
                break;
              }
            }
          });

          return Array.from(uniqueLinks);
        },
        PRIORITY_PAGES,
        homepage,
      );

      await browser.close();

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: links.slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    } finally {
      await browser.close();
    }
  }
}

export const crawlService = new CrawlService();
