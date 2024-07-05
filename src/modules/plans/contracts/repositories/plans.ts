import { Plan } from '../../entities/plan';
import { ICreatePlanDTO } from '../dtos/create-plan-dto';

export interface IPlansRepository {
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  findyByPriceId(priceId: string): Promise<Plan | null>;
  create(plan: ICreatePlanDTO): Promise<Plan>;
  save(plan: Plan): Promise<Plan>;
}
