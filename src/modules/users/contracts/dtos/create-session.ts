export interface ICreateSessionDTO {
  email: string;
  password: string;
  role: 'patient' | 'professional' | 'manager' | 'debug';
}
