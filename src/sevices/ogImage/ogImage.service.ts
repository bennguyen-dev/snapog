import { PrismaClient } from "@prisma/client";
import {
  ICreateOGImage,
  IOGImageDetail,
} from "@/sevices/ogImage/ogImage.interface";
import { IResponse } from "@/lib/type";
import { storageService } from "@/sevices/storage";
import { prisma } from "@/lib/db";

class OGImageService {
  async create({
    src,
  }: ICreateOGImage): Promise<IResponse<IOGImageDetail | null>> {
    try {
      const ogImage = await prisma.oGImage.create({
        data: {
          src,
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

const ogImageService = new OGImageService();

export default ogImageService;
