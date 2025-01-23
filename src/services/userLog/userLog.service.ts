import { prisma } from "@/lib/db";
import { ICreateUserLog } from "@/services/userLog";

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

  async getLogs({ userId }: { userId: string }) {
    try {
      const logs = await prisma.userLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: logs,
        message: "User logs fetched successfully",
        status: 200,
      };
    } catch (error) {
      console.error("Error fetching user logs:", error);
      return {
        data: null,
        message: "Failed to fetch user logs",
        status: 500,
      };
    }
  }
}

export const userLogService = new UserLogService();
