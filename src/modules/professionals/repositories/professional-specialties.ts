import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

export class ProfessionalSpecialtiesRepository
  implements IProfessionalSpecialtiesRepository
{
  private ormRepository: Repository<ProfessionalSpecialty>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProfessionalSpecialty,
    );
  }

  public async findAll(): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<ProfessionalSpecialty> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
