import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { IMAGE_TYPES } from "@/lib/constants";
import { IResponse } from "@/lib/type";
import {
  IDeleteFolders,
  IDeleteImages,
  IUploadImage,
  IUploadImageResponse,
} from "@/services/storage";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const cloudFrontClient = new CloudFrontClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

class StorageService {
  private async invalidateCloudFrontCache(paths: string[]) {
    try {
      const command = new CreateInvalidationCommand({
        DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID as string,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: paths.length,
            Items: paths.map((path) => `/${path}`),
          },
        },
      });

      await cloudFrontClient.send(command);
    } catch (error) {
      console.error(`Error invalidating CloudFront cache: ${error}`);
    }
  }

  async uploadImage({
    image,
    key,
  }: IUploadImage): Promise<IResponse<IUploadImageResponse | null>> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      Body: image,
      ContentType: IMAGE_TYPES.PNG.MIME,
    });

    // Upload image
    try {
      await s3Client.send(command);

      // Invalidate CloudFront cache
      await this.invalidateCloudFrontCache([key]);

      return {
        message: "Image uploaded successfully",
        status: 200,
        data: {
          src: key,
        },
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

      // Invalidate CloudFront cache
      await this.invalidateCloudFrontCache(keys);

      return {
        message: "Images deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting images: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
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

      // Invalidate CloudFront cache
      await this.invalidateCloudFrontCache(prefixes);

      return {
        message: "Folder deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting folder: ${error}`);
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
