export interface IPagarmeCustomerDTO {
  id: string;
  name: string;
  email: string;
  code: string;
  document: string;
  type: string;
  delinquent: boolean;
  address: {
    id: string;
    line_1: string;
    street: string;
    number: string;
    zip_code: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    status: string;
    created_at: string;
    updated_at: string;
    metadata: unknown;
  };
  created_at: string;
  updated_at: string;
  phones: {
    mobile_phone: {
      country_code: string;
      number: string;
      area_code: string;
    };
  };
  metadata: unknown;
}
