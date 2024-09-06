// create demo
export interface ICreateDemo {
  domain: string;
  numberOfImages?: number;
}

export interface ICreateDemoResponse {
  domain: string;
}

// get demo
export interface IGetDemo {
  domain: string;
}

export interface IGetDemoResponse {
  id: string;
  url: string;
  OGImage?: string;
  OGTitle?: string;
  OGDescription?: string;
  SnapOgImage?: string;
}
