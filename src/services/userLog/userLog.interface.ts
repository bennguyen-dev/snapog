import { LOG_STATUS, LOG_TYPE } from "@prisma/client";

export interface ICreateUserLog {
  userId: string;
  amount: number;
  type: LOG_TYPE;
  status: LOG_STATUS;
  metadata: Record<string, any>;
}
