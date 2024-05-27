export interface ICreatePage {
  url: string;
  siteId: string;
}

export interface IGetPageBy {
  url?: string;
  siteId?: string;

  id?: string;
}

export interface IPageDetail {
  id: string;
  url: string;
  siteId: string;
  image?: string;
  title?: string;
  description?: string;

  createdAt: Date;
  updatedAt: Date;
}
