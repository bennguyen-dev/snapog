// Configure AWS SDK
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  IDeleteImage,
  IUploadImage,
  IUploadImageResponse,
} from "@/sevices/storage";
import { IResponse } from "@/lib/type";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

class StorageService {
  async uploadImage({
    image,
    folder,
    fileName,
    type,
  }: IUploadImage): Promise<IResponse<IUploadImageResponse | null>> {
    const key = `${folder}/${fileName}.${type.EXTENSION}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      Body: image,
      ContentType: type.MIME,
    });

    // Upload image
    try {
      await s3Client.send(command);

      // const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        message: "Image uploaded successfully",
        status: 200,
        data: {
          url: key,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }

  async deleteImage({ key }: IDeleteImage): Promise<IResponse<null>> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
    });
    try {
      await s3Client.send(command);
      return {
        message: "Image deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }
}

export const storageService = new StorageService();
