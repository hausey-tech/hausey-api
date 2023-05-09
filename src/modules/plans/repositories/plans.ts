import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreatePlanDTO } from '../contracts/dtos/create-plan-dto';
import { IPlansRepository } from '../contracts/repositories/plans';
import { Plan } from '../entities/plan';

export class PlansRepository implements IPlansRepository {
  private ormRepository: Repository<Plan>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Plan);
  }

  public async findAll(): Promise<Plan[]> {
    return this.ormRepository.find();
  }

  public async findByName(name: string): Promise<Plan | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findyByPriceId(priceId: string): Promise<Plan | null> {
    return this.ormRepository.findOne({ where: { stripePriceId: priceId } });
  }

  public async create(plan: ICreatePlanDTO): Promise<Plan> {
    return this.ormRepository.create(plan);
  }

  public async save(plan: Plan): Promise<Plan> {
    return this.ormRepository.save(plan);
  }
}
