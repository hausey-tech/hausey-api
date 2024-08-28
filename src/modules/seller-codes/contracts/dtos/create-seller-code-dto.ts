export interface ICreateSellerCodeDTO {
  code: string;
  sellerId: string;
  promotionCodeId: string;
  discount: number;
  fee?: number;
  maxUse?: number;
  free?: boolean;
}
