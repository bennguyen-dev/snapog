export interface IGetCheckoutUrl {
  productId: string;
}

export interface IGetCheckoutUrlResponse {
  checkoutUrl: string;
}

export interface IGetProductBy {
  id?: string;
  polarId?: string;
}
