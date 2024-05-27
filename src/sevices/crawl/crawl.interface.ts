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
