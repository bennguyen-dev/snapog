export interface ICreateUserBalance {
  userId: string;
  paidCredits?: number;
  freeCredits?: number;
}

export interface IUpdateUserBalance {
  userId: string;
  paidCredits?: number;
  freeCredits?: number;
  usedCredits?: number;
}

export interface IGetUserBalanceByUserId {
  userId: string;
}

export interface IDeductCredits {
  userId: string;
  amount: number;
}

export interface IIncrementPaidCredits {
  userId: string;
  amount: number;
}
