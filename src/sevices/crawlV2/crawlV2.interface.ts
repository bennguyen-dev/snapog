// get links of domain
export interface IGetLinksOfDomain {
  domain: string;
  limit?: number;
}

export interface IGetLinksOfDomainResponse {
  urls: string[];
}
