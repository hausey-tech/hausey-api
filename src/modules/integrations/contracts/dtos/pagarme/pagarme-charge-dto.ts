import { IPagarmeCustomerDTO } from './pagarme-customer-dto';

export interface IPagarmeChargeDTO {
  id: string;
  code: string;
  gateway_id: string;
  amount: number;
  paid_amount: number;
  status: string;
  currency: string;
  payment_method: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
  pending_cancellation: boolean;
  customer: IPagarmeCustomerDTO;
  last_transaction: {
    transaction_type: string;
    pix_provider_tid: string;
    qr_code: string;
    qr_code_url: string;
    end_to_end_id: string;
    payer: {
      name: string;
      document: string;
      document_type: string;
      bank_account: {
        bank_name: string;
        ispb: string;
      };
    };
    expires_at: string;
    id: string;
    gateway_id: string;
    amount: number;
    status: string;
    success: boolean;
    created_at: string;
    updated_at: string;
    gateway_response: unknown;
    antifraud_response: unknown;
    metadata: unknown;
  };
  metadata: unknown;
}
