export interface IResponse<T> {
  message: string;
  status: number;
  data: T;
}
