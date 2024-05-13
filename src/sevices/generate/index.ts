import cheerio from "cheerio";
import puppeteer from "puppeteer";
import fs from "fs";

export const GenerateService = () => {
  const fetchInternalLinks = async (domain: string): Promise<string[]> => {
    try {
      const response = await fetch(domain);
      const htmlContent = await response.text();
      const $ = cheerio.load(htmlContent);

      const internalLinksSet = new Set<string>(); // Using Set to store unique links

      $("a").each((index, element) => {
        const href = $(element).attr("href");
        if (href && href.startsWith(domain)) {
          internalLinksSet.add(href); // Add link to the Set
        }
      });

      return Array.from(internalLinksSet); // Convert Set to Array
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return [];
    }
  };

  const generateOGImage = async (
    url: string,
  ): Promise<{ url: string; base64Image: string } | null> => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set viewport size
      await page.setViewport({ width: 1280, height: 800 });

      const response = await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      }); // Set timeout to 60 seconds

      // Check if the response status is okay (2xx or 3xx)
      if (!response || !response.ok()) {
        console.error(`Error loading page: ${url}`);
        await browser.close();
        return null;
      }

      // Check for UI elements on the page (optional)
      const bodyContentExist = await page.evaluate(() => {
        // Check if the body contains any content
        return document.body && document.body.innerHTML.trim().length > 0;
      });

      if (!bodyContentExist) {
        console.error(`No body content found on page: ${url}`);
        await browser.close();
        return null;
      }

      // Capture screenshot
      const screenshot = await page.screenshot();

      // Close page and browser after capturing screenshot
      await page.close();
      await browser.close();

      const base64Screenshot = screenshot.toString("base64");
      const base64Image = `data:image/png;base64,${base64Screenshot}`;

      return { url, base64Image };
    } catch (error) {
      console.error("Error generating OG image:", error);
      return null;
    }
  };

  const generateOGImagesForDomain = async (
    domain: string,
  ): Promise<{ url: string; base64Image: string }[]> => {
    try {
      const internalLinks = await fetchInternalLinks(domain);

      console.log("internalLinks 😋", { internalLinks }, "");

      // Limit the number of pages to 4
      const pagesToCapture = internalLinks.slice(0, 4);

      // Generate screenshots for each page concurrently
      const screenshotPromises = pagesToCapture.map((url) =>
        generateOGImage(url),
      );
      const ogImages = await Promise.all(screenshotPromises);

      // Filter out null values (in case of errors during screenshot generation)
      return ogImages.filter(Boolean) as { url: string; base64Image: string }[];
    } catch (error) {
      console.error("Error generating OG images for domain:", error);
      return [];
    }
  };

  return {
    generateOGImagesForDomain,
  };
};
