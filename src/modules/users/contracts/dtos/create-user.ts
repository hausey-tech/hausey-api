export interface ICreateUserDTO {
  name: string;
  email: string;
  password?: string;
  cpf?: string;
  birthdate?: string;
  sex?: number;
  phoneNumber?: string;
}
