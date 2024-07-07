import { Browser } from "puppeteer-core";

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
