import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUrlWithProtocol(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
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

export function getSnippetHowToUse(domain: string) {
  return `  <!-- Put in your <head> tag -->
  <meta
    property="og:image"
    content="https://${window.location.host}/api/get-image?url=${domain}/your/example/path"
  />`;
}

export function getLinkSmartOGImage(url: string) {
  return `https://${window.location.host}/api/get-image?url=${getUrlWithoutProtocol(url)}`;
}
