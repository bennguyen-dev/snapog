export interface IGetUserUsage {
  userId: string;
}

export interface IIncrementUsage {
  userId: string;
}

export interface IUsageResponse {
  current: number;
  limit: number;
  periodStart: Date | null;
  periodEnd: Date | null;
}

export interface IUsageDetail extends IUsageResponse {
  id: string;
  userId: string;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
