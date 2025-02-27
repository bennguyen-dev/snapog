import { ReactNode } from "react";

import { IUserLogStatus, IUserLogType } from "@/services/userLog";

export interface IResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface IFilterParams {
  cursor?: string;
  pageSize?: number;
  search?: string;

  filter?: {
    amounts?: ("plus" | "minus" | "zero")[];
    types?: IUserLogType[];
    statuses?: IUserLogStatus[];
    dateFrom?: Date | string;
    dateTo?: Date | string;
  };
}

export interface IResponseWithCursor<T> {
  message: string;
  status: number;
  data: {
    data: T;
    nextCursor: string | null;
  };
}
export type ValuesOf<T> = T[keyof T];

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: string;
  description?: string;
  children?: NavItem[];
}
