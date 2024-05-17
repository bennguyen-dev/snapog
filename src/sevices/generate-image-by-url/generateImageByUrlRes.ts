export interface GenerateImageByUrlRes {
  image: Buffer | null;
  url: string;
  title?: string;
  description?: string;
  imageOG?: string;
}
