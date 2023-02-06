export interface ICreateProfessionalDTO {
  email: string;
  password: string;
  name: string;
  document: string;
  birthdate: string;
  phoneNumber: string;
  sex: 'M' | 'F';
  specialties: string[];
  registration: string;
  registrationUf: string;
}
