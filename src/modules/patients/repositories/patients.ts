import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

export class PatientsRepository implements IPatientsRepository {
  private ormRepository: Repository<Patient>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Patient);
  }

  public async findById(id: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async findByEmail(email: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: ['plan'],
    });
  }

  public async create(payload: ICreatePatientDTO): Promise<Patient> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: Patient): Promise<Patient> {
    return this.ormRepository.save(patient);
  }
}
