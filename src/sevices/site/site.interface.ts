export interface ICreateSiteReq {
  userId: string;
  domain: string;
}

export interface IGetSiteByUserIdReq {
  userId: string;
}

export interface ISiteDetail {
  id: string;
  domain: string;
  userId: string;
}
