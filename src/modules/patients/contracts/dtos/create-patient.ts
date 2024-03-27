export interface ICreatePatientDTO {
  email: string;
  password: string;
  name: string;
  document?: string;
  birthdate?: string;
  phoneNumber: string;
  sex?: 'M' | 'F';
  planId?: string;
  sellerId: string;
}
