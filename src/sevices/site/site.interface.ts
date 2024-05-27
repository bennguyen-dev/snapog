export interface ICreateSite {
  userId: string;
  domain: string;
}

export interface IGetSitesByUserId {
  userId: string;
}

export interface IGetSiteByDomain {
  domain: string;
}

export interface ISiteDetail {
  id: string;
  domain: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
