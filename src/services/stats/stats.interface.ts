export interface IStatsRequest {
  userId: string;
}

export interface IStatsResponse {
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  sites: {
    total: number;
    details: {
      id: string;
      name: string;
      pageCount: number;
    }[];
  };
  totalPages: number;
}
