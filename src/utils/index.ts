import { type ClassValue, clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUrlWithProtocol(url: string) {
  // If the URL starts with http or https, return it as is

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  } else {
    return `https://${url}`;
  }
}

/**
 * Cleans and normalizes URLs by:
 * - Converting backslashes to forward slashes
 * - Removing trailing slashes
 * - Converting hostname to lowercase
 * - Handling special characters
 * - Properly encoding URL segments
 * - Removing hash fragments and query parameters
 *
 * @param url - The URL string to clean
 * @returns A cleaned and normalized URL string, or empty string if invalid
 */
export function cleanUrl(url: string): string {
  if (!url) return "";

  try {
    // Step 1: Pre-process backslashes - convert all backslashes to forward slashes
    url = url.replace(/\\/g, "/");

    // Step 2: Parse and normalize URL using the URL constructor
    // This also validates the URL format
    const urlObj = new URL(url);

    // Step 3: Start building the new URL with protocol and lowercase hostname
    let newUrl = urlObj.protocol + "//" + urlObj.hostname.toLowerCase();

    // Step 4: Add port if it's not the default port for the protocol
    if (
      urlObj.port &&
      !(
        (urlObj.protocol === "http:" && urlObj.port === "80") ||
        (urlObj.protocol === "https:" && urlObj.port === "443")
      )
    ) {
      newUrl += ":" + urlObj.port;
    }

    // Step 5: Process the pathname
    const path = urlObj.pathname
      // Replace multiple consecutive slashes (both forward and backward) with a single forward slash
      .replace(/[\/\\]+/g, "/")
      // Remove trailing slash
      .replace(/\/$/, "")
      // Remove unsafe special characters
      .replace(/[<>{}|\\^~\[\]`]/g, "")
      // Process each path segment separately
      .split("/")
      .map((segment) => {
        // Decode first to prevent double-encoding
        const decoded = decodeURIComponent(segment);
        // Re-encode to ensure proper URL encoding
        return encodeURIComponent(decoded);
      })
      .join("/");

    // Step 6: Append the processed path to the URL if it exists
    if (path) newUrl += path;

    return newUrl;
  } catch (error) {
    // Return empty string for invalid URLs
    // Alternative: could throw an error or return the original URL
    return "";
  }
}

export function sanitizeFilename(url: string) {
  // Replace / with -
  url = url.replace(/\//g, "-");

  // Replace . with space
  url = url.replace(/\./g, "");

  // Remove special characters
  return slugify(url, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function getUrlWithoutProtocol(url: string) {
  // Remove "https://" if present
  let modifiedUrl = url.replace(/^https:\/\//i, "");

  // Remove "http://" if present
  modifiedUrl = modifiedUrl.replace(/^http:\/\//i, "");

  // Remove / if present last
  modifiedUrl = modifiedUrl.replace(/\/$/i, "");

  return modifiedUrl;
}

export function getDomainName(url: string) {
  return new URL(getUrlWithProtocol(url?.trim()))?.hostname;
}

export function getImageLinkFromAWS(key: string) {
  return `https://${process.env.AWS_CDN_HOSTNAME}/${key}`;
}

export function getSnippetHowToUse({
  host,
  domain,
  apiKey,
}: {
  host: string;
  domain: string;
  apiKey: string;
}) {
  return `<!-- Put in your <head> tag -->
<meta
  property="og:image"
  content="${getLinkSmartOGImage({ host, url: domain, apiKey })}"
/>`;
}

export function getLinkSmartOGImage({
  host,
  url,
  apiKey,
}: {
  host: string;
  url: string;
  apiKey: string;
}) {
  return `https://${host}/api/${apiKey}?url=${getUrlWithoutProtocol(url)}`;
}

export function formatPrice(priceInCents: number, currency: string = "USD") {
  const price = parseFloat(priceInCents.toString());
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date: string | Date, format?: "short" | "long") {
  if (!date) {
    return "";
  }

  if (format === "short") {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    minute: "numeric",
    hour: "numeric",
  });
}
