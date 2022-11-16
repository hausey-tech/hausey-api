import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

export class SpecialtiesRepository implements ISpecialtiesRepository {
  private ormRepository: Repository<ProfessionalSpecialty>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProfessionalSpecialty,
    );
  }

  public async findAll(): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find();
  }
}
