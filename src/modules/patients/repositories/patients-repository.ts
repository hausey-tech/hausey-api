import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPatientsRepository } from '../contracts';
import { Patient } from '../entities';

export class PatientsRepository implements IPatientsRepository {
  private ormRepository: Repository<Patient>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Patient);
  }

  public async findByUserId(id: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { userId: id },
      relations: ['user', 'plan'],
    });
  }
}
