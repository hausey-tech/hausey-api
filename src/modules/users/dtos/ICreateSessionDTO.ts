export default interface ICreateSessionDTO {
  email: string;
  password: string;
  role: 'patient' | 'professional' | 'manager';
}
