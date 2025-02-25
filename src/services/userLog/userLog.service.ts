import { prisma } from "@/lib/db";
import { ICreateUserLog, IUserLog } from "@/services/userLog";
import { IResponseWithCursor, ISearchParams } from "@/types/global";

class UserLogService {
  async create({ userId, type, metadata, amount, status }: ICreateUserLog) {
    try {
      const log = await prisma.userLog.create({
        data: {
          userId,
          amount,
          status,
          type,
          metadata,
        },
      });

      return {
        data: log,
        message: "User log created successfully",
        status: 201,
      };
    } catch (error) {
      console.error("Error creating user log:", error);
      return {
        data: null,
        message: "Failed to create credit log",
        status: 500,
      };
    }
  }

  async getLogs({
    userId,
    cursor,
    pageSize = 10,
  }: {
    userId: string;
  } & ISearchParams): Promise<IResponseWithCursor<IUserLog[] | null>> {
    try {
      const results = await prisma.userLog.findMany({
        where: { userId },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor = null;
      if (results.length > pageSize) {
        const nextItem = results.pop();
        nextCursor = nextItem?.id || null;
      }

      return {
        message: "User logs fetched successfully",
        status: 200,
        data: {
          data: results,
          nextCursor,
        },
      };
    } catch (error) {
      console.error("Error fetching user logs:", error);
      return {
        message: "Failed to fetch user logs",
        status: 500,
        data: {
          data: null,
          nextCursor: null,
        },
      };
    }
  }
}

export const userLogService = new UserLogService();
