interface Cycle {
  start_at: Date;
  end_at: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  delinquent: boolean;
  created_at: Date;
  updated_at: Date;
}

interface BillingAddress {
  line_1: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface CreditCard {
  id: string;
  holder_name: string;
  masked_number: string;
  exp_month: number;
  exp_year: number;
  expired: boolean;
  status: string;
  created_at: Date;
  update_at: Date;
  billing_address: BillingAddress;
}

interface Discount {
  id: string;
  cycles: number;
  value: number;
  discount_type: string;
  created_at: Date;
}

interface Increment {
  id: string;
  cycles: number;
  value: number;
  discount_type: string;
  created_at: Date;
}

interface PricingScheme {
  price: number;
  scheme_type: string;
}

interface Item {
  id: string;
  description: string;
  quantity: number;
  pricing_scheme: PricingScheme;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Metadata {
  id: string;
}

interface Paging {
  total_items: number;
  current_page: number;
  total_pages: number;
}

interface Subscription {
  id: string;
  payment_method: string;
  currency: string;
  interval: string;
  gateway_affiliation_id: string;
  boleto_due_days: number;
  minimum_price: number;
  interval_count: number;
  billing_type: string;
  current_cycle: Cycle;
  next_billing_at: Date;
  installments: number;
  customer: Customer;
  credit_card: CreditCard;
  discounts: Discount[];
  increments: Increment[];
  items: Item[];
  status: string;
  created_at: Date;
  updated_at: Date;
  metadata: Metadata;
}

export interface ResponsePagarmeSubscription {
  data: Subscription[];
  paging: Paging;
}
