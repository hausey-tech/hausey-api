import { PlanType } from '../../entities/plan';

export interface ICreatePlanDTO {
  name: string;
  description?: string;
  price: number;
  type?: PlanType;
  maxDependents?: number;
}
