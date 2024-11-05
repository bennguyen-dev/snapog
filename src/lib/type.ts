import { ReactNode } from "react";

declare global {
  interface Window {
    createLemonSqueezy: any;
    LemonSqueezy: any;
  }
}

export interface IResponse<T> {
  message: string;
  status: number;
  data: T;
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
}
