import puppeteer from "puppeteer";
import { GenerateImageReq, GenerateImageRes } from "@/sevices/generate-image";

export const generateImageByUrl = async (
  req: GenerateImageReq,
): Promise<GenerateImageRes> => {
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

    // Close page and browser after capturing screenshot
    await page.close();
    await browser.close();

    return {
      image: screenshot,
      url: url,
    };
  } catch (error) {
    console.error("Error generating OG image:", error);
    return {
      image: null,
      url: url,
    };
  }
};
