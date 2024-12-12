export interface ICreatePurchaseHistory {
  userId: string;
  purchaseId: string;
  paidAmount: number;
  creditAmount: number;
}

export interface IGetPurchaseHistoryByUserId {
  userId: string;
  take?: number;
  skip?: number;
}

export interface IGetPurchaseHistoryById {
  id: string;
}
