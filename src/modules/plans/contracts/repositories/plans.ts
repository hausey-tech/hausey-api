import { Plan } from '../../entities/plan';

export interface IPlansRepository {
  findAll(): Promise<Plan[]>;
}
