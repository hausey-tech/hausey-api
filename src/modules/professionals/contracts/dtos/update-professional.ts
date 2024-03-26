export interface IUpdateProfessionalDTO {
  email?: string;
  name?: string;
  password?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  specialties?: string[];
  registration?: string;
  registrationUf?: string;
  roleId?: string;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiresIn?: Date | null;
}
