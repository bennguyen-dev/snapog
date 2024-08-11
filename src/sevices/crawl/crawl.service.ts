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
import { crawlServiceV2 } from "@/sevices/crawlV2";

class CrawlService {
  public async getInfoByUrl({
    url,
  }: IGetInfoByUrl): Promise<IResponse<IGetInfoByUrlResponse | null>> {
    console.time(`Total execution time crawl info for url: ${url}`);

    const urlWithProtocol = getUrlWithProtocol(url);
    const host = new URL(urlWithProtocol).host;

    let browser: Browser | null = null;

    try {
      console.time(`Launching browser for url: ${url}`);
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
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
          "--disable-features=site-per-process",
        ],
        defaultViewport: { width: 1200, height: 630 },
        executablePath: await chromium.executablePath(
          `https://${process.env.AWS_CDN_HOSTNAME}/chromium/chromium-v123.0.1-pack.tar`,
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });
      console.timeEnd(`Launching browser for url: ${url}`);

      if (!browser) {
        return {
          status: 500,
          message: "Failed to launch browser",
          data: null,
        };
      }

      const page = await browser.newPage();
      // Optimize page load
      // await page.setRequestInterception(true);
      // page.on("request", (req) => {
      //   if (
      //     ["image", "stylesheet", "font", "script", "media"].includes(
      //       req.resourceType(),
      //     )
      //   ) {
      //     req.abort();
      //   } else {
      //     req.continue();
      //   }
      // });

      console.time(`Go to url: ${urlWithProtocol}`);
      const response = await page.goto(urlWithProtocol, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      console.timeEnd(`Go to url: ${urlWithProtocol}`);

      if (!response || !response.ok()) {
        await browser.close();

        return {
          status: 500,
          message: "Failed to load page",
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
        return {
          status: 500,
          message: `No body content found on page: ${url}`,
          data: null,
        };
      }

      // wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.time(`Screenshot and get info: ${url}`);
      const [screenshot, title, description, ogImage] = await Promise.all([
        page.screenshot({ optimizeForSpeed: true }),
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
      console.timeEnd(`Screenshot and get info: ${url}`);

      await page.close();

      // Convert ogImage to absolute URL if it's relative
      let absoluteOgImage = ogImage;
      if (ogImage && !ogImage.startsWith("http")) {
        absoluteOgImage = `https://${host}${ogImage}`;
      }

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: urlWithProtocol,
          screenshot: screenshot,
          title,
          description: description || undefined,
          ogImage: absoluteOgImage || undefined,
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
    page,
  }: ICrawlLinksInPage): Promise<IResponse<ICrawlLinksInPageResponse | null>> {
    const homepage = getUrlWithProtocol(domain);

    console.time(`Total execution time crawl links for domain: ${domain}`);
    try {
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
        return {
          status: 500,
          message: "Failed to load page",
          data: null,
        };
      }

      const internalLinks = await page.evaluate(
        (homepage, limit) => {
          const uniqueLinks = new Set<string>();
          const homepageObj = new URL(homepage);

          const addLink = (href: string) => {
            try {
              // Remove trailing slash from href
              if (href.endsWith("/")) {
                href = href.slice(0, -1);
              }

              const url = new URL(href, homepage);
              url.search = "";

              if (url.pathname.endsWith("/")) {
                url.pathname = url.pathname.slice(0, -1);
              }

              let cleanedHref = url.href;
              if (cleanedHref.endsWith("/")) {
                cleanedHref = cleanedHref.slice(0, -1);
              }

              if (
                url.hostname === homepageObj.hostname &&
                !uniqueLinks.has(cleanedHref)
              ) {
                uniqueLinks.add(cleanedHref);
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
      console.timeEnd(`Total execution time crawl links for domain: ${domain}`);
    }
  }

  private async searchSiteLinks({
    domain,
    limit = 10,
    page,
  }: ISearchSiteLinks): Promise<IResponse<ISearchSiteLinksResponse | null>> {
    const homepage = getUrlWithProtocol(domain);

    console.time(
      `Total execution time search site links for domain: ${domain}`,
    );
    try {
      const query = `site:${domain}`;
      let currentPage = 1;
      let uniqueLinks = new Set<string>();

      while (uniqueLinks.size < limit) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${(currentPage - 1) * 10}`;
        await page.goto(searchUrl, { waitUntil: "networkidle0" });

        const links = await page.evaluate(
          (homepage, currentLimit) => {
            const uniqueLinks = new Set<string>();
            const homepageObj = new URL(homepage);

            const addLink = (href: string) => {
              try {
                // Remove trailing slash from href
                if (href.endsWith("/")) {
                  href = href.slice(0, -1);
                }

                const url = new URL(href, homepage);
                url.search = "";

                if (url.pathname.endsWith("/")) {
                  url.pathname = url.pathname.slice(0, -1);
                }

                let cleanedHref = url.href;
                if (cleanedHref.endsWith("/")) {
                  cleanedHref = cleanedHref.slice(0, -1);
                }

                if (
                  url.hostname === homepageObj.hostname &&
                  !uniqueLinks.has(cleanedHref)
                ) {
                  uniqueLinks.add(cleanedHref);
                }
              } catch (e) {
                // Invalid URL, skip
              }
            };

            document.querySelectorAll(".yuRUbf").forEach((element) => {
              if (uniqueLinks.size >= currentLimit) return;

              const linkElement = element.querySelector("a");
              if (linkElement?.href) {
                addLink(linkElement.href);
              }
            });

            return Array.from(uniqueLinks);
          },
          homepage,
          limit - uniqueLinks.size,
        );

        const newLinksCount = links.length;
        uniqueLinks = new Set([...Array.from(uniqueLinks), ...links]);

        if (newLinksCount === 0) {
          console.log("No more results found. Stopping search.");
          break;
        }

        currentPage++;
      }

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: Array.from(uniqueLinks).slice(0, limit),
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

    console.time(`Execute get links of domain: ${domain}`);
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

      const pageSearch = await browser.newPage();
      const pageCrawl = await browser.newPage();

      let urls = new Set<string>();

      const thirdPartyResult =
        await crawlServiceV2.getLinksOfDomainWithWeeTools({
          domain,
          limit,
        });

      if (thirdPartyResult.data?.urls?.length) {
        urls = new Set([...Array.from(urls), ...thirdPartyResult.data.urls]);
      } else {
        const crawlResult = await this.crawlLinksInPage({
          domain,
          limit,
          page: pageCrawl,
        });

        if (crawlResult.data?.urls?.length) {
          urls = new Set([...Array.from(urls), ...crawlResult.data.urls]);
        } else {
          const searchResult = await this.searchSiteLinks({
            domain,
            limit,
            page: pageSearch,
          });

          if (searchResult.data?.urls?.length) {
            urls = new Set([...Array.from(urls), ...searchResult.data.urls]);
          }
        }
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
      console.time(`Execute get links of domain: ${domain}`);
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
      delay: 2000,
      "accept-language": "en-US,en;q=0.9",
      click: "[class*='close'],[class*='accept']", // click on the close button
    };

    const params = new URLSearchParams({
      ...defaultOptions,
      config,
      url: url,
      key: process.env.SCREENSHOT_MACHINE_KEY,
    } as unknown as Record<string, string>);

    const apiUrl = `https://api.screenshotmachine.com?${params.toString()}`;

    try {
      console.time(`Execute screenshotmachine api for ${url}`);
      const screenshotmachineRes = await fetch(apiUrl);
      console.timeEnd(`Execute screenshotmachine api for ${url}`);

      if (!screenshotmachineRes.ok) {
        throw new Error(
          `Failed to fetch screenshot: ${screenshotmachineRes.status}`,
        );
      }

      return Buffer.from(await screenshotmachineRes.arrayBuffer());
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

export const crawlService = new CrawlService();
