export interface ICreateUserDTO {
  email: string;
  password: string;
  name: string;
  document: string;
  birthdate: string;
  phoneNumber: string;
  sex: 'M' | 'F';
  roleId: string;
}
