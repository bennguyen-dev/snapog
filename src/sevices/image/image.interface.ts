export interface IGetImageByUrl {
  url: string;
}

export interface IGetImageByUrlResponse {
  image: Buffer;
  contentType: string;
}

export interface IGetImageByImageLink {
  imageLink: string;
}

export interface IGetImageByImageLinkResponse {
  image: Buffer;
  contentType: string;
}
