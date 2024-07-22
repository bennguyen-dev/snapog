import chromium from "@sparticuz/chromium-min";
import puppeteer, { Browser } from "puppeteer-core";

import { IResponse } from "@/lib/type";
import { getUrlWithProtocol } from "@/lib/utils";
import {
  ICrawlLinksInPage,
  ICrawlLinksInPageResponse,
  IGetInfoByUrl,
  IGetInfoByUrlResponse,
  IGetLinksByDomain,
  IGetLinksByDomainResponse,
  IScreenshotByScreenshotmachine,
  ISearchSiteLinks,
  ISearchSiteLinksResponse,
} from "@/sevices/crawl";

class CrawlService {
  public async getInfoByUrl({
    url,
  }: IGetInfoByUrl): Promise<IResponse<IGetInfoByUrlResponse | null>> {
    console.time(`Total execution time crawl info for url: ${url}`);

    const urlWithProtocol = getUrlWithProtocol(url);

    let browser: Browser | null = null;

    try {
      console.time(`Total execution time launch browser for url: ${url}`);
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--hide-scrollbars",
          "--disable-web-security",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
        defaultViewport: { width: 1200, height: 628 },
        executablePath: await chromium.executablePath(
          `https://${process.env.AWS_CDN_HOSTNAME}/chromium/chromium-v123.0.1-pack.tar`,
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });
      console.timeEnd(`Total execution time launch browser for url: ${url}`);

      if (!browser) {
        return {
          status: 500,
          message: "Failed to launch browser",
          data: null,
        };
      }

      const page = await browser.newPage();

      // Optional: Set a custom user agent to avoid mobile redirects
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      console.time(`Total execution time goto url: ${url}`);
      const response = await page.goto(urlWithProtocol, {
        waitUntil: "networkidle0",
        timeout: 30000, // 30 seconds timeout for page load
      });
      console.timeEnd(`Total execution time goto url: ${url}`);

      if (!response || !response.ok()) {
        await browser.close();

        return {
          status: 500,
          message: "Failed to load page",
          data: null,
        };
      }

      // Wait for any remaining animations to complete
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
      );

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

      console.time(`Total execution time screenshot: ${url}`);
      const [screenshot, title, description, ogImage] = await Promise.all([
        this.screenshotByScreenshotmachine({ url }),
        page.title(),
        page
          .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
          .catch(() => ""),
        page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute("content"),
          )
          .catch(() => undefined),
      ]);
      console.timeEnd(`Total execution time screenshot: ${url}`);

      await page.close();

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: urlWithProtocol,
          screenShot: screenshot?.data || null,
          title,
          description: description || undefined,
          ogImage: ogImage || undefined,
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
      await browser?.close();
      console.timeEnd(`Total execution time crawl info for url: ${url}`);
    }
  }

  private async crawlLinksInPage({
    domain,
    limit = 10,
    browser,
  }: ICrawlLinksInPage): Promise<IResponse<ICrawlLinksInPageResponse | null>> {
    const homepage = getUrlWithProtocol(domain);

    console.time(`Total execution time crawl links for domain: ${domain}`);
    try {
      const page = await browser.newPage();

      // Disable image loading
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (
          ["image", "stylesheet", "font", "media"].includes(req.resourceType())
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      const response = await page.goto(homepage, {
        waitUntil: "domcontentloaded",
        timeout: 60000, // 60 seconds timeout for page load
      });

      if (!response || !response.ok()) {
        await browser.close();
        return {
          status: 500,
          message: "Failed to load page",
          data: null,
        };
      }

      console.time(`Link extraction for site: ${homepage}`);
      const internalLinks = await page.evaluate(
        (homepage, limit) => {
          const uniqueLinks = new Set<string>();
          const homepageUrlObj = new URL(homepage);

          uniqueLinks.add(homepage);

          const addLink = (href: string) => {
            try {
              const linkUrl = new URL(href, homepage);
              linkUrl.search = ""; // Remove the query string

              if (
                linkUrl.hostname === homepageUrlObj.hostname &&
                !uniqueLinks.has(linkUrl.href)
              ) {
                uniqueLinks.add(linkUrl.href);
              }
            } catch (e) {
              // Invalid URL, skip
            }
          };

          // Select links based on their location and attributes
          const selectors = [
            "nav a", // Navigation links
            "header a", // Header links
            "footer a", // Footer links
            "a.important-link", // Links with 'important-link' class
            "a#main-menu", // Links with 'main-menu' id
            "a.main-nav", // Links with 'main-nav' class
            'a[href^="/"]', // Internal links starting with /
            'a[role="button"]', // Links that act as buttons
            ".sidebar a", // Sidebar links
            "main a", // Links in the main content area
          ];

          document
            .querySelectorAll<HTMLAnchorElement>(selectors.join(","))
            .forEach((el) => addLink(el.href));

          if (uniqueLinks.size <= limit) {
            document
              .querySelectorAll<HTMLAnchorElement>("a[href]")
              .forEach((element) => {
                if (uniqueLinks.size >= limit) return;
                if (
                  element.querySelector("img") ||
                  element.innerText.trim().length > 20 ||
                  element.getAttribute("target") === "_blank"
                ) {
                  addLink(element.href);
                }
              });
          }

          return Array.from(uniqueLinks);
        },
        homepage,
        limit,
      );
      console.timeEnd(`Link extraction for site: ${homepage}`);

      console.log(`Found ${internalLinks.length} important internal links`);
      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: Array.from(internalLinks).slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      browser?.close();

      console.timeEnd(`Total execution time crawl links for domain: ${domain}`);
    }
  }

  private async searchSiteLinks({
    domain,
    limit = 10,
    browser,
  }: ISearchSiteLinks): Promise<IResponse<ISearchSiteLinksResponse | null>> {
    console.time(
      `Total execution time search site links for domain: ${domain}`,
    );
    try {
      const page = await browser.newPage();

      const homepage = getUrlWithProtocol(domain);
      const query = `site:${domain}`;
      let currentPage = 1;
      let urls = new Set<string>();

      urls.add(homepage);

      while (urls.size < limit) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${(currentPage - 1) * 10}`;
        console.log(`Navigating to page ${currentPage}: ${searchUrl}`);

        console.time(`Page ${currentPage} navigation and processing`);
        await page.goto(searchUrl, { waitUntil: "networkidle0" });
        console.log(`Page ${currentPage} loaded`);

        const links = await page.evaluate(
          (homepage, currentLimit) => {
            const uniqueLinks = new Set<string>();
            const homepageObj = new URL(homepage);

            document.querySelectorAll(".yuRUbf").forEach((element) => {
              if (uniqueLinks.size >= currentLimit) return;

              const linkElement = element.querySelector("a");
              if (linkElement?.href) {
                const url = new URL(linkElement.href);

                url.search = ""; // Remove the query string

                if (
                  url.hostname === homepageObj.hostname &&
                  !uniqueLinks.has(url.toString())
                ) {
                  uniqueLinks.add(url.toString());
                }
              }
            });

            console.log(`Found ${uniqueLinks.size} unique links on this page`);
            return Array.from(uniqueLinks);
          },
          homepage,
          limit - urls.size,
        );

        console.timeEnd(`Page ${currentPage} navigation and processing`);

        const newLinksCount = links.length;
        urls = new Set([...Array.from(urls), ...links]);

        console.log(`Page ${currentPage} results:`);
        console.log(`- Found ${newLinksCount} new links`);
        console.log(`- Total unique links so far: ${urls.size}`);
        console.log(
          `- Remaining links to fetch: ${Math.max(0, limit - urls.size)}`,
        );

        if (newLinksCount === 0) {
          console.log("No more results found. Stopping search.");
          break;
        }

        currentPage++;
      }

      await browser.close();

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: Array.from(urls).slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      await browser?.close();
      console.timeEnd(
        `Total execution time search site links for domain: ${domain}`,
      );
    }
  }

  public async getLinksByDomain({
    domain,
    limit,
  }: IGetLinksByDomain): Promise<IResponse<IGetLinksByDomainResponse | null>> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
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
          `https://${process.env.AWS_CDN_HOSTNAME}/chromium/chromium-v123.0.1-pack.tar`,
        ),
        ignoreHTTPSErrors: true,
        headless: true,
      });

      if (!browser) {
        return {
          status: 500,
          message: "Failed to launch browser",
          data: null,
        };
      }

      const [searchResult, crawlResult] = await Promise.allSettled([
        this.searchSiteLinks({ domain, limit, browser }),
        this.crawlLinksInPage({ domain, limit, browser }),
      ]);

      // filter duplicated links
      let urls = new Set<string>();

      if (searchResult.status === "fulfilled" && searchResult.value?.data) {
        console.log(
          `Search result found ${searchResult.value.data.urls.length} links`,
        );
        urls = new Set([...Array.from(urls), ...searchResult.value.data.urls]);
      }

      if (crawlResult.status === "fulfilled" && crawlResult.value?.data) {
        console.log(
          `Crawl result found ${crawlResult.value.data.urls.length} links`,
        );
        urls = new Set([...Array.from(urls), ...crawlResult.value.data.urls]);
      }

      if (
        searchResult.status === "fulfilled" &&
        !searchResult.value?.data &&
        crawlResult.status === "fulfilled" &&
        !crawlResult.value?.data
      ) {
        return {
          status: 500,
          message: `Get links failed - search: ${searchResult?.value?.message} - crawl: ${crawlResult?.value?.message}`,
          data: null,
        };
      }

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: Array.from(urls).slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      await browser?.close();
    }
  }

  public async screenshotByScreenshotmachine({
    url,
    config,
  }: IScreenshotByScreenshotmachine): Promise<IResponse<Buffer | null>> {
    const apiUrl = "https://www.screenshotmachine.com/capture.php";
    const defaultOptions = {
      device: "desktop",
      width: 1366,
      height: 840,
      zoom: 100,
      format: "png",
      timeout: 4000,
      cacheLimit: 0,
    };

    const params = new URLSearchParams({
      ...defaultOptions,
      config,
      url: url,
    } as unknown as Record<string, string>);

    try {
      console.time(`execute screenshotmachine api for ${url}`);
      const screenshotmachineRes = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          origin: "https://www.screenshotmachine.com",
          referer:
            "https://www.screenshotmachine.com/website-screenshot-generator.php",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
        body: params,
      });
      console.timeEnd(`execute screenshotmachine api for ${url}`);

      if (!screenshotmachineRes.ok) {
        return {
          message: `Failed to fetch screenshot: ${screenshotmachineRes.status}`,
          status: 500,
          data: null,
        };
      }

      const apiResponse = await screenshotmachineRes.json();

      if (apiResponse.status !== "success") {
        return {
          message: apiResponse.message,
          status: 500,
          data: null,
        };
      }

      console.log("apiResponse 😋", { apiResponse }, "");

      const imageUrl = `https://www.screenshotmachine.com/${apiResponse.link}`;
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        return {
          message: `Failed to fetch screenshot: ${imageResponse.status}`,
          status: 500,
          data: null,
        };
      }

      return {
        message: "Screenshot fetched successfully",
        status: 200,
        data: Buffer.from(await imageResponse.arrayBuffer()),
      };
    } catch (error) {
      console.error("Error fetching screenshot:", error);
      return {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }
}

export const crawlService = new CrawlService();
