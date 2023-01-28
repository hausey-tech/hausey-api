import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IUpdatePatientDTO } from '../contracts/dtos/update-patient';
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

  public async findByEmailWithDeleted(email: string): Promise<Patient | null> {
    return this.ormRepository.findOne({ where: { email }, withDeleted: true });
  }

  public async findByDocument(document: string): Promise<Patient | null> {
    return this.ormRepository.findOne({ where: { document } });
  }

  public async restore(
    id: string,
    payload: ICreatePatientDTO,
  ): Promise<Patient> {
    await this.ormRepository.restore(id);
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async create(payload: ICreatePatientDTO): Promise<Patient> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: Patient): Promise<Patient> {
    return this.ormRepository.save(patient);
  }

  public async update(
    id: string,
    payload: IUpdatePatientDTO,
  ): Promise<Patient> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }
}
