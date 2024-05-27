import { ValuesOf } from "@/lib/type";
import { IMAGE_TYPES } from "@/lib/constants";

export interface IUploadImage {
  image: Buffer;
  folder: string;
  fileName: string;
  type: ValuesOf<typeof IMAGE_TYPES>;
}

export interface IUploadImageResponse {
  url: string;
}
