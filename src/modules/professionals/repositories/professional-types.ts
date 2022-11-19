import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProfessionalTypesRepository } from '../contracts/repositories/professional-types';
import { ProfessionalType } from '../entities/professional-type';

export class ProfessionalTypesRepository
  implements IProfessionalTypesRepository
{
  private ormRepository: Repository<ProfessionalType>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(ProfessionalType);
  }

  public async findAll(): Promise<ProfessionalType[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<ProfessionalType> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
