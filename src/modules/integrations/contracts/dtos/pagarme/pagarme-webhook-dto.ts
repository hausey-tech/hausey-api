import { IPagarmeChargeDTO } from './pagarme-charge-dto';
import { IPagarmeCustomerDTO } from './pagarme-customer-dto';
import { IPagarmeItemDTO } from './pagarme-item-dto';

export interface IPagarmeWebhookDTO {
  id: string;
  account: {
    id: string;
    name: string;
  };
  type: string;
  created_at: string;
  data: {
    code: string;
    amount: number;
    currency: string;
    closed: boolean;
    items: IPagarmeItemDTO[];
    customer: IPagarmeCustomerDTO;
    status: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    charges: IPagarmeChargeDTO[];
    metadata: unknown;
  };
}
