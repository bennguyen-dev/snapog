import { ReactNode } from "react";

export interface IResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface ISearchParams {
  cursor?: string;
  pageSize?: number;
  search?: string;
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
