export interface ICreateSite {
  userId: string;
  domain: string;
}

export interface IGetSitesBy {
  userId?: string;
  domain?: string;

  id?: string;
}

export interface IGetSiteBy {
  userId?: string;
  domain?: string;

  id?: string;
}

export interface IDeleteAllSiteBy {
  userId?: string;
  domain?: string;

  id?: string;
}

export interface ISiteDetail {
  id: string;
  domain: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
