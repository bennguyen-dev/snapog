import { GetImageByUrlReq, GetImageByUrlRes } from "@/sevices/get-image-by-url";
import { generateImageByUrl } from "../generate-image-by-url";

export const getImageByUrl = async (
  req: GetImageByUrlReq,
): Promise<GetImageByUrlRes | null> => {
  const url = req.url;

  const result = await generateImageByUrl({ url });

  return result.image;
};
