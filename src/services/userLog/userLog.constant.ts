import { LOG_STATUS, LOG_TYPE } from "@prisma/client";

export const USER_LOG_TYPE = LOG_TYPE;

export const USER_LOG_STATUS = LOG_STATUS;

export const MAPPING_USER_LOG_TYPE = {
  [LOG_TYPE.FREE_CREDITS]: "Free Credits",
  [LOG_TYPE.PURCHASE_CREDITS]: "Purchase Credits",
  [LOG_TYPE.PAGE_CREATION]: "Page Creation",
  [LOG_TYPE.PAGE_MANUAL_REFRESH]: "Page Manual Refresh",
};
