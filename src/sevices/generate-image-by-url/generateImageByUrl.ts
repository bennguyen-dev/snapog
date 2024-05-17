import puppeteer from "puppeteer";
import {
  GenerateImageByUrlReq,
  GenerateImageByUrlRes,
} from "@/sevices/generate-image-by-url";

export const generateImageByUrl = async (
  req: GenerateImageByUrlReq,
): Promise<GenerateImageByUrlRes> => {
  const url = req.url;

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
      return {
        image: null,
        url: url,
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
        image: null,
        url: url,
      };
    }

    // Capture screenshot
    const screenshot = await page.screenshot();

    // Get title and description, image
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
      image: screenshot,
      url: url,
      title,
      description: description as string,
      imageOG: image as string,
    };
  } catch (error) {
    console.error("Error generating OG image:", error);
    return {
      image: null,
      url: url,
    };
  }
};
