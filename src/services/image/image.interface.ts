import { IHeaders } from "@/services/page";

export interface IGenerateOGImage {
  url: string;
  apiKey: string;
  headers?: IHeaders;
}

export interface IGenerateOGImageResponse {
  image: Buffer;
  contentType: string;
}

export interface IGetImageByImageLink {
  imageLink: string;
}

export interface IGetImageByImageLinkResponse {
  image: Buffer;
  contentType: string;
  size: number;
}
