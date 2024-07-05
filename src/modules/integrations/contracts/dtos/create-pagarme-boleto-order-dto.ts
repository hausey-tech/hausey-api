export interface ICreatePagarmeBoletoOrderDTO {
  planId: string;
  quantity: number;
  userId: string;
  customer: {
    name: string;
    type: string;
    document: string;
  };
}
