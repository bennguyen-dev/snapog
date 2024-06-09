// Configure AWS SDK
import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  IDeleteFolders,
  IDeleteImages,
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

  async deleteImages({ keys }: IDeleteImages): Promise<IResponse<null>> {
    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    });
    try {
      await s3Client.send(command);
      return {
        message: "Images deleted successfully",
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

  async deleteFolders({ prefixes }: IDeleteFolders): Promise<IResponse<null>> {
    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Delete: {
        Objects: prefixes.map((prefix) => ({ Key: prefix })),
        Quiet: false,
      },
    });
    try {
      await s3Client.send(command);
      return {
        message: "Folder deleted successfully",
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
