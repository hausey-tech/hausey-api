export interface IUpdatePatientDTO {
  name?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  planId?: string;
  sellerId?: string;
  fcmToken?: string;
}
