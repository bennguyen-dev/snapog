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
