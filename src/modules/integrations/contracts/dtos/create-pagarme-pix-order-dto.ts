import { Plan } from '../../../plans/entities/plan';
import { IPagarmeSplitDTO } from './pagarme/pagarme-split-dto';

export interface ICreatePagarmePixOrderDTO {
  customerId: string;
  plan: Plan;
  price: number;
  split?: IPagarmeSplitDTO[];
}
