import { Repository } from 'typeorm';

import { IPatientAnamnesesRepository } from '../contracts/repositories/patient-anamneses';
import { ICreatePatientAnamnesisDTO } from '../contracts/dtos/create-patient-anamnesis';
import { PostgresDataSource } from '../../../shared/typeorm';
import { PatientAnamnesis } from '../entities/patient-anamnesis';

export class PatientAnamnesesRepository implements IPatientAnamnesesRepository {
  private ormRepository: Repository<PatientAnamnesis>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientAnamnesis);
  }

  public async findByPatientId(patientId: string): Promise<PatientAnamnesis[]> {
    return this.ormRepository.find({
      where: { patientId },
      order: { createdAt: 'desc' },
      relations: ['appointment'],
    });
  }

  public async create(
    patientAnamnesis: ICreatePatientAnamnesisDTO,
  ): Promise<PatientAnamnesis> {
    return this.ormRepository.create(patientAnamnesis);
  }

  public async save(
    patientAnamnesis: PatientAnamnesis,
  ): Promise<PatientAnamnesis> {
    return this.ormRepository.save(patientAnamnesis);
  }
}
