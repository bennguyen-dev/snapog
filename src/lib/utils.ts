import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function verifyUrl(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

export function sanitizeFilename(url: string) {
  return slugify(url, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: "_",
  });
}

export function getUrlWithoutProtocol(url: string) {
  // Remove "https://" if present
  let modifiedUrl = url.replace(/^https:\/\//i, "");

  // Remove "http://" if present
  modifiedUrl = modifiedUrl.replace(/^http:\/\//i, "");

  return modifiedUrl;
}
