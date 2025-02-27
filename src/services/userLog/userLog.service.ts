import { prisma } from "@/lib/db";
import { ICreateUserLog, IUserLog } from "@/services/userLog";
import { IResponseWithCursor, IFilterParams } from "@/types/global";

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
    search,
    filter,
  }: {
    userId: string;
  } & IFilterParams): Promise<IResponseWithCursor<IUserLog[] | null>> {
    try {
      const whereCondition: any = { userId };

      const amounts = filter?.amounts;
      const types = filter?.types;
      const statuses = filter?.statuses;
      const dateFrom = filter?.dateFrom;
      const dateTo = filter?.dateTo;

      // Apply amount filter (multiple values)
      if (amounts && amounts.length > 0) {
        const amountConditions = [];

        for (const filter of amounts) {
          switch (filter) {
            case "plus":
              amountConditions.push({ amount: { gt: 0 } });
              break;
            case "minus":
              amountConditions.push({ amount: { lt: 0 } });
              break;
            case "zero":
              amountConditions.push({ amount: { equals: 0 } });
              break;
          }
        }

        if (amountConditions.length > 0) {
          // If we already have an OR condition from search
          if (whereCondition.OR) {
            // We need to wrap the existing OR and the new amount OR in an AND
            whereCondition.AND = [
              { OR: whereCondition.OR },
              { OR: amountConditions },
            ];
            delete whereCondition.OR;
          } else {
            whereCondition.OR = amountConditions;
          }
        }
      }

      // Apply type filter (multiple values)
      if (types && types.length > 0) {
        whereCondition.type = { in: types };
      }

      // Apply status filter (multiple values)
      if (statuses && statuses.length > 0) {
        whereCondition.status = { in: statuses };
      }

      // Apply date range filter
      if (dateFrom || dateTo) {
        whereCondition.createdAt = {};

        if (dateFrom) {
          whereCondition.createdAt.gte = dateFrom;
        }

        if (dateTo) {
          whereCondition.createdAt.lte = dateTo;
        }
      }

      // Apply search filter
      if (search && search.trim() !== "") {
        const searchCondition = [
          {
            metadata: {
              path: ["productName"],
              string_contains: search,
            },
          },
          {
            metadata: {
              path: ["userAgent"],
              string_contains: search,
            },
          },
          {
            metadata: {
              path: ["error", "message"],
              string_contains: search,
            },
          },
          {
            metadata: {
              path: ["pageUrl"],
              string_contains: search,
            },
          },
        ];

        // If we already have an OR condition from amount filters
        if (whereCondition.OR) {
          // We need to wrap the existing OR and the new search OR in an AND
          whereCondition.AND = [
            { OR: whereCondition.OR },
            { OR: searchCondition },
          ];
          delete whereCondition.OR;
        } else {
          whereCondition.OR = searchCondition;
        }
      }

      const results = await prisma.userLog.findMany({
        where: whereCondition,
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
