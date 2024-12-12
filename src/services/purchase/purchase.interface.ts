export interface ICreatePurchase {
  name: string;
  description?: string;
  creditAmount: number;
  price: number;
  active?: boolean;
}

export interface IUpdatePurchase extends Partial<ICreatePurchase> {
  id: string;
}

export interface IGetPurchaseById {
  id: string;
}

export interface IGetActivePurchases {
  take?: number;
  skip?: number;
}
