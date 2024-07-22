import { Browser } from "puppeteer-core";

export interface IGetInfoByUrl {
  url: string;
}

export interface IGetInfoByUrlResponse {
  url: string;
  screenShot: Buffer | null;
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface ICrawlLinksInPage extends IGetLinksByDomain {
  browser: Browser;
}
export interface ICrawlLinksInPageResponse extends IGetLinksByDomainResponse {}

export interface ISearchSiteLinks extends IGetLinksByDomain {
  browser: Browser;
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
    width: number;
    height: number;
    zoom: number;
    format: "png" | "jpeg" | "gif";
    timeout: number;
    cacheLimit: number;
  };
}
