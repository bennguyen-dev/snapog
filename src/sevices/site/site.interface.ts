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

export interface IUpdateSiteBy {
  id: string;

  cacheDurationDays?: number;
  overridePage?: boolean;
}

export interface IDeleteSitesBy {
  userId?: string;
  domain?: string;

  id?: string;
}

export interface ISiteDetail {
  id: string;
  domain: string;
  userId: string;
  cacheDurationDays?: number;

  createdAt: Date;
  updatedAt: Date;
}
