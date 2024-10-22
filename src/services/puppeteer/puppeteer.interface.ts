export interface IGetInfo {
  url: string;
}

export interface IGetInfoResponse {
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
  screenshot?: any;
}
