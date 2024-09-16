export interface ICreateSellerCodeDTO {
  code: string;
  sellerId: string;
  discounts?: {
    planId: string;
    discount: number;
  }[];
  fee?: number;
  maxUse?: number;
  free?: boolean;
}
