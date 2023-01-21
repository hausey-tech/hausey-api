export interface ICreateProfessionalDTO {
  email: string;
  password: string;
  name: string;
  document: string;
  birthdate: string;
  phoneNumber: string;
  sex: 'M' | 'F';
  specialtyId: string;
  specialtyRegistration: string;
  registration: string;
  registrationUf: string;
}
