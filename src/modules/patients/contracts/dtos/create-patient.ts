export interface ICreatePatientDTO {
  email?: string | null;
  password?: string;
  name: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  planId?: string;
  sellerId?: string;
  planExpiresAt?: Date | string;
  firstPayment?: boolean;
  language?: string;
  region?: string;
}
