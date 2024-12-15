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

export function cleanUrl(url: string) {
  let newUrl = url;

  newUrl = newUrl.replace(/\/$/, ""); // Remove trailing slash
  newUrl = newUrl.split("#")[0]; // Remove hash
  newUrl = newUrl.split("?")[0]; // Remove search string

  return newUrl;
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
  return `https://${host}/api/get?api_key=${apiKey}&url=${getUrlWithoutProtocol(url)}`;
}
