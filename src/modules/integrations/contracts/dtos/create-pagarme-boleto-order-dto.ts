export interface ICreatePagarmeBoletoOrderDTO {
  price: number;
  date: string;
  userId: string;
  customer: {
    name: string;
    type: string;
    document: string;
  };
}
