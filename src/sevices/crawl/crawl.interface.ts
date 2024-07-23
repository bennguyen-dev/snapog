import { Page } from "puppeteer-core";

export interface IGetInfoByUrl {
  url: string;
}

export interface IGetInfoByUrlResponse {
  url: string;
  screenShot: Buffer;
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface ICrawlLinksInPage extends IGetLinksByDomain {
  page: Page;
}

export interface ICrawlLinksInPageResponse extends IGetLinksByDomainResponse {}

export interface ISearchSiteLinks extends IGetLinksByDomain {
  page: Page;
}

export interface ISearchSiteLinksResponse extends IGetLinksByDomainResponse {}

export interface IGetLinksByDomain {
  domain: string;
  limit?: number;
}

export interface IGetLinksByDomainResponse {
  urls: string[];
}

export interface IScreenshotByScreenshotmachine {
  url: string;
  config?: {
    device: "desktop" | "tablet" | "mobile";
    dimension: string;
    zoom: number;
    format: "png" | "jpeg" | "gif";
    delay: number;
    cacheLimit: number; // If you prefer fresh screenshot for every API call, please use cacheLimit=0 parameter.
  };
}
