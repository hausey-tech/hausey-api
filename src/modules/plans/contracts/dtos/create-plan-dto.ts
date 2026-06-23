export interface ICreatePlanDTO {
  name: string;
  description?: string;
  price: number;
  isPro?: boolean;
  type?: 'Individual' | 'Familiar';
}
