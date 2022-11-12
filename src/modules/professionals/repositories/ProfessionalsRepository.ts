import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';

import IProfessionalsRepository from './IProfessionalsRepository';
import Professional from '../entities/Professional';

class ProfessionalsRepository implements IProfessionalsRepository {
  private ormRepository: Repository<Professional>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Professional);
  }

  public async findByUserId(id: string): Promise<Professional | null> {
    return this.ormRepository.findOne({
      where: { userId: id },
      relations: ['user', 'professionalSpecialty', 'professionalType'],
    });
  }
}

export default ProfessionalsRepository;
