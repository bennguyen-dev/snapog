import { Site } from "@prisma/client";

export interface ISiteDetail extends Site {}

export interface ICreateSite {
  userId: string;
  domain: string;

  cacheDurationDays?: number;
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
