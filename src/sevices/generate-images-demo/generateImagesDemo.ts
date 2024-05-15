import {
  GenerateImagesDemoReq,
  GenerateImagesDemoRes,
} from "@/sevices/generate-images-demo";
import { getUrlByDomain } from "@/sevices/get-url-by-domain";
import { generateImageByUrl } from "@/sevices/generate-image";

export const generateImagesDemo = async (
  req: GenerateImagesDemoReq,
): Promise<GenerateImagesDemoRes[]> => {
  const { domain, numberOfImages = 4 } = req;

  try {
    const { urls } = await getUrlByDomain({ domain });

    // Limit the number of pages to numberOfImages
    const pagesToCapture = urls.slice(0, numberOfImages);

    // Generate screenshots for each page concurrently
    const screenshotPromises = pagesToCapture.map((url) =>
      generateImageByUrl({ url }),
    );
    const ogImages = await Promise.all(screenshotPromises);

    const results: GenerateImagesDemoRes[] = [];
    // Filter out null values (in case of errors during screenshot generation)
    ogImages.forEach((result) => {
      if (result.image) {
        results.push({
          url: result.url,
          base64Image: `data:image/png;base64,${result.image.toString("base64")}`,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Error generating OG images for domain:", error);
    return [];
  }
};
