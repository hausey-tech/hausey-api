export interface IAddDependentWithAppDTO {
  holderId: string;
  hasAppAccess: true;
  email: string;
}

export interface IAddDependentWithoutAppDTO {
  holderId: string;
  hasAppAccess: false;
  name: string;
  birthdate: string;
  cpf: string;
  sex: 'M' | 'F';
}

export type IAddDependentDTO =
  | IAddDependentWithAppDTO
  | IAddDependentWithoutAppDTO;
