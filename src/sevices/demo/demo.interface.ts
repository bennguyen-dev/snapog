export interface IGetDemo {
  domain: string;
}

export interface ICreateDemo {
  domain: string;
  numberOfImages?: number;
}

export interface IGetDemoResponse {
  id: string;
  url: string;
  OGImage?: string;
  OGTitle?: string;
  OGDescription?: string;
  SnapOgImage?: string;
}
