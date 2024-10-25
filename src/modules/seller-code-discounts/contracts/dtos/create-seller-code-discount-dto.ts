export interface ICreateSellerCodeDiscountDTO {
  sellerCodeId: string;
  planId: string;
  discount: number;
  stripePromoCodeId?: string;
}
