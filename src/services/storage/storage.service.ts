import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { IMAGE_TYPES } from "@/constants";
import { IUploadImage, IUploadImageResponse } from "@/services/storage";
import { IResponse } from "@/types/global";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

class StorageService {
  async uploadImage({
    image,
    key,
  }: IUploadImage): Promise<IResponse<IUploadImageResponse | null>> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME as string,
      Key: key,
      Body: image,
      ContentType: IMAGE_TYPES.PNG.MIME,
    });

    try {
      await s3Client.send(command);

      return {
        message: "Image uploaded successfully",
        status: 200,
        data: { src: key },
      };
    } catch (error) {
      console.error(`Error uploading image: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const storageService = new StorageService();
