export interface IUpdateUserDTO {
  name?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
}
