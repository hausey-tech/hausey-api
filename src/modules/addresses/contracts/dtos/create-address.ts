export interface ICreateAddressDTO {
  professionalId?: string;
  patientId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipOrPostcode?: string;
  country: string;
}
