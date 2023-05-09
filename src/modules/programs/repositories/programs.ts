import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProgramsRepository } from '../contracts/repositories/programs';
import { Program } from '../entities/program';

export class ProgramsRepository implements IProgramsRepository {
  private ormRepository: Repository<Program>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Program);
  }

  public async findAll(): Promise<Program[]> {
    return this.ormRepository.find();
  }
}
