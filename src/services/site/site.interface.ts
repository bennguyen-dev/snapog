import { Site } from "@prisma/client";

export interface ISiteDetail extends Site {}

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

export interface IDeleteSitesBy {
  userId?: string;
  domain?: string;

  id?: string;
}
