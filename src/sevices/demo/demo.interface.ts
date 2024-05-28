export interface IGetDemo {
  domain: string;
  numberOfImages?: number;
}

export interface IGetDemoResponse {
  url: string;
  smartOgImageBase64: string;
  title?: string;
  description?: string;
  ogImage?: string;
}
