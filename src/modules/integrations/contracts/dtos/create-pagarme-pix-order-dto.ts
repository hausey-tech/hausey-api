import { Plan } from '../../../plans/entities/plan';

export interface ICreatePagarmePixOrderDTO {
  customerId: string;
  plan: Plan;
  price: number;
  months: number;
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
