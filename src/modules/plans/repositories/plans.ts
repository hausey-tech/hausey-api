import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
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
}
