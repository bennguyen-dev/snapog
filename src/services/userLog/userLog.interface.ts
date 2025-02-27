import { LOG_STATUS, LOG_TYPE, UserLog } from "@prisma/client";

export interface IUserLog extends UserLog {}

export type IUserLogType = LOG_TYPE;

export type IUserLogStatus = LOG_STATUS;

export interface ICreateUserLog {
  userId: string;
  amount: number;
  type: LOG_TYPE;
  status: LOG_STATUS;
  metadata: Record<string, any>;
}
