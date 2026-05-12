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
