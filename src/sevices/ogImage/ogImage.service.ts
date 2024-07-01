import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  ICreateOGImage,
  IOGImageDetail,
  IUpdateOGImage,
} from "@/sevices/ogImage/ogImage.interface";
import { storageService } from "@/sevices/storage";

class OGImageService {
  async create({
    src,
    expiresAt,
  }: ICreateOGImage): Promise<IResponse<IOGImageDetail | null>> {
    try {
      const ogImage = await prisma.oGImage.create({
        data: {
          src,
          expiresAt,
        },
      });
      return {
        message: "OG Image created successfully",
        status: 200,
        data: ogImage,
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

  async updateBy({
    id,
    src,
    expiresAt,
  }: IUpdateOGImage): Promise<IResponse<IOGImageDetail | null>> {
    try {
      const ogImage = await prisma.oGImage.update({
        where: {
          id,
        },
        data: {
          src,
          expiresAt,
        },
      });

      if (!ogImage) {
        return {
          message: "OG Image not found",
          status: 404,
          data: null,
        };
      }

      return {
        message: "OG Image updated successfully",
        status: 200,
        data: ogImage,
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

  async deleteBy({ id }: { id: string }): Promise<IResponse<null>> {
    try {
      const ogImage = await prisma.oGImage.findUnique({
        where: {
          id,
        },
      });

      if (!ogImage) {
        return {
          message: "OG Image not found",
          status: 404,
          data: null,
        };
      }

      await prisma.oGImage.delete({
        where: {
          id,
        },
      });

      // delete images from storage
      await storageService.deleteImages({
        keys: [ogImage.src],
      });

      return {
        message: "OG Image deleted successfully",
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

export const ogImageService = new OGImageService();
