import { LOG_STATUS, LOG_TYPE, UserLog } from "@prisma/client";

export interface IUserLog extends UserLog {}

export interface ICreateUserLog {
  userId: string;
  amount: number;
  type: LOG_TYPE;
  status: LOG_STATUS;
  metadata: Record<string, any>;
}
