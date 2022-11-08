import { Repository } from 'typeorm';

import { PostgresDataSource } from '@shared/infra/typeorm';

import IPatientsRepository from '@modules/patients/repositories/IPatientsRepository';
import Patient from '../entities/Patient';

class PatientsRepository implements IPatientsRepository {
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

export default PatientsRepository;
