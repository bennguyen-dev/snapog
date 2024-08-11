import { IResponse } from "@/lib/type";
import { getUrlWithProtocol } from "@/lib/utils";
import {
  IGetLinksOfDomain,
  IGetLinksOfDomainResponse,
} from "@/sevices/crawlV2";

class CrawlServiceV2 {
  public async getLinksOfDomainWithWeeTools({
    domain,
    limit,
  }: IGetLinksOfDomain): Promise<IResponse<IGetLinksOfDomainResponse | null>> {
    const baseUrl = getUrlWithProtocol(domain);

    const headers = {
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    };
    const data = `data=${baseUrl}`;

    console.time(`Get links with wee.tools for domain: ${domain}`);
    try {
      const response = await fetch(
        "https://wee.tools/links-extractor/link_extract.php",
        {
          method: "POST",
          headers: headers,
          body: data,
        },
      );

      if (!response.ok) {
        console.error("Error:", response.statusText);
        return {
          status: 500,
          message: response.statusText,
          data: null,
        };
      }

      const result: any = await response.json();

      // Filter and limit internal links that start with the baseUrl and do not start with "mailto:"
      const filteredInternalLinks = new Set<string>();

      filteredInternalLinks.add(baseUrl);

      if (!result.internal) {
        return {
          status: 200,
          message: "Success",
          data: {
            urls: [],
          },
        };
      }

      for (let link of Object.values<any>(result.internal)) {
        link = link.split("|")[0];
        if (
          link.startsWith(baseUrl) &&
          !link.includes("mailto:") &&
          !link.includes("tel:") &&
          !link.includes("sms:") &&
          !link.includes("skype:") &&
          !link.includes("whatsapp:") &&
          !link.includes("callto:") &&
          !link.includes("viber:") &&
          !link.includes("telegram:")
        ) {
          const url = new URL(link);
          url.search = "";

          filteredInternalLinks.add(url.toString());
          if (limit && filteredInternalLinks.size >= limit) {
            break;
          }
        }
      }

      // Sort the links, placing those with paths before those with fragments
      const sortedInternalLinks = Array.from(filteredInternalLinks).sort(
        (a, b) => {
          const aHasHash = a.includes("#");
          const bHasHash = b.includes("#");

          // Links with paths come before those with fragments
          if (!aHasHash && bHasHash) return -1;
          if (aHasHash && !bHasHash) return 1;
          return 0;
        },
      );

      // Limit the number of URLs based on the provided limit
      const limitedInternalLinks = sortedInternalLinks.slice(
        0,
        limit,
      ) as string[];

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: limitedInternalLinks,
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
      console.timeEnd(`Get links with wee.tools for domain: ${domain}`);
    }
  }
}

export const crawlServiceV2 = new CrawlServiceV2();
