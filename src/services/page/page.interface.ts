export interface IHeaders {
  "user-agent"?: string;
  "x-forwarded-for"?: string;
  "x-real-ip"?: string;
  [key: string]: string | undefined;
}

export interface ICreatePage {
  url: string;
  siteId: string;
  headers?: IHeaders;
}

export interface IGetPageBy {
  url?: string;
  siteId?: string;
  id?: string;
  headers?: IHeaders;
}

export interface IUpdatePagesBy {
  id?: string;
  siteId?: string;
  cacheDurationDays?: number | null;
  headers?: IHeaders;
}

export interface IDeletePagesBy {
  siteId?: string;
  id?: string;
  headers?: IHeaders;
}

export interface IInvalidateCachePageBy {
  id: string;
  userId: string;
  headers?: IHeaders;
}
