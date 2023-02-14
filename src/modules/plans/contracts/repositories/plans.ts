import { Plan } from '../../entities/plan';
import { ICreatePlanDTO } from '../dtos/create-plan-dto';

export interface IPlansRepository {
  findAll(): Promise<Plan[]>;
  findByName(name: string): Promise<Plan | null>;
  create(plan: ICreatePlanDTO): Promise<Plan>;
  save(plan: Plan): Promise<Plan>;
}
