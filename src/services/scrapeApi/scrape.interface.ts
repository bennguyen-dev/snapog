export interface IScraperInfo {
  url: string;
}

export interface IScraperInfoResponse {
  url: string;
  screenshot?: Buffer;
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface IScrapeInternalLinks {
  url: string;
  limit?: number;
}

export interface IScrapeInternalLinksResponse {
  links: string[];
}
