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

export interface IGetAllUrlByDomain {
  domain: string;
  limit?: number;
}

export interface IGetAllUrlByDomainResponse {
  urls: string[];
}
