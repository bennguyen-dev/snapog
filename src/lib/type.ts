export interface IResponse<T> {
  message: string;
  status: number;
  data: T;
}

export type ValuesOf<T> = T[keyof T];
