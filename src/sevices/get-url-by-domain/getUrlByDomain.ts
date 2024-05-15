import {
  GetUrlByDomainReq,
  GetUrlByDomainRes,
} from "@/sevices/get-url-by-domain";
import cheerio from "cheerio";

export const getUrlByDomain = async (
  req: GetUrlByDomainReq,
): Promise<GetUrlByDomainRes> => {
  const domain = req.domain;

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

    return { urls: Array.from(internalLinksSet) }; // Convert Set to Array
  } catch (error) {
    console.error("Error fetching internal links:", error);
    return {
      urls: [],
    };
  }
};
