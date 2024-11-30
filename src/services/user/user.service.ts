import crypto from "node:crypto";

import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  IGetUser,
  IRegenerateApiKey,
  IRegenerateApiKeyResponse,
  IUser,
} from "@/services/user";

class UserService {
  async getUser({
    apiKey,
    userId,
    email,
  }: IGetUser): Promise<IResponse<IUser | null>> {
    try {
      let user: IUser | null = null;

      await prisma.$transaction(async (tx) => {
        if (apiKey) {
          user = await tx.user.findUnique({
            where: {
              apiKey,
            },
          });
        } else if (userId) {
          user = await tx.user.findUnique({
            where: {
              id: userId,
            },
          });
        } else if (email) {
          user = await tx.user.findUnique({
            where: {
              email,
            },
          });
        }
      });

      if (!user) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "User fetched successfully",
        data: user,
      };
    } catch (error) {
      console.error(`Error while getting user: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async regenerateApiKey({
    userId,
  }: IRegenerateApiKey): Promise<IResponse<IRegenerateApiKeyResponse | null>> {
    const generateApiKey = (): string => {
      return `og_${crypto.randomBytes(8).toString("hex")}`; // Creates a 16-char key + 3-char prefix
    };

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { apiKey: generateApiKey() },
        select: { apiKey: true },
      });

      return {
        status: 200,
        message: "API key regenerated successfully",
        data: { apiKey: user.apiKey as string },
      };
    } catch (error) {
      console.error("Error regenerating API key:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const userService = new UserService();
