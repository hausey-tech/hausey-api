import { Plan } from '../../../plans/entities/plan';

export interface ICreatePagarmeCardOrderDTO {
  customerId: string;
  plan: Plan;
  price: number;
  months: number;
  creditCard: {
    installments: number;
    cardToken: string;
    statement_descriptor: string;
  };
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };
  split?: {
    amount: number;
    recipientId: string;
    type: string;
    options: {
      chargeProcessingFee: boolean;
      chargeRemainderFee: boolean;
      liable: boolean;
    };
  }[];
}
