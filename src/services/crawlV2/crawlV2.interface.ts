// get metadata
export interface IGetMetadataOfUrl {
  url: string;
}

export interface IGetMetadataOfUrlResponse {
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
}

// get internal links
export interface IGetInternalLinksOfDomain {
  domain: string;
  limit?: number;
}

export interface IGetInternalLinksOfDomainResponse {
  urls: string[];
}

// screenshot by screenshotmachine
export interface IScreenshotByScreenshotmachine {
  url: string;
  config?: {
    device?: "desktop" | "tablet" | "mobile";
    dimension?: string;
    zoom?: number;
    format?: "png" | "jpeg" | "gif";
    delay?: number;
    cacheLimit?: number; // If you prefer fresh screenshot for every API call, please use cacheLimit=0 parameter.
    click?: string; // https://www.w3schools.com/cssref/css_selectors.php, use '' not ""
  };
}

// crawl info of url
export interface ICrawlInfoOfUrl {
  url: string;
  configScreenshot?: IScreenshotByScreenshotmachine["config"];
}

export interface ICrawlInfoOfUrlResponse extends IGetMetadataOfUrlResponse {
  screenshot: Buffer;
}
