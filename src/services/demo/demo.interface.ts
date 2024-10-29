// create demo
export interface ICreateDemo {
  url: string;
  numberOfImages?: number;
}

export interface ICreateDemoResponse {
  domain: string;
}

// get demo
export interface IGetDemo {
  url: string;
}

export interface IGetDemoResponse {
  id: string;
  url: string;
  OGImage?: string;
  OGTitle?: string;
  OGDescription?: string;
  SnapOgImage?: string;
}
