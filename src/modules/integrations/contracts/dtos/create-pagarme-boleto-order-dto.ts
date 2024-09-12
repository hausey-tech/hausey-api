export interface ICreatePagarmeBoletoOrderDTO {
  price: number;
  date: string;
  users: {
    id: string;
    amount: number;
  }[];
  customer: {
    name: string;
    type: string;
    document: string;
  };
}
