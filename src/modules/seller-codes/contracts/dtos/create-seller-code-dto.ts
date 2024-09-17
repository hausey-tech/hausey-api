export interface ICreateSellerCodeDTO {
  code: string;
  sellerId: string;
  fee?: number;
  free?: boolean;
  maxUse?: number;
  discounts?: {
    planId: string;
    discount: number;
  }[];
  sellers?: {
    sellerId: string;
    fee: number;
  }[];
}
