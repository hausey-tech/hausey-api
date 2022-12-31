import { Repository } from 'typeorm';

import { IPatientPrimaryDiagnosesRepository } from '../contracts/repositories/patient-primary-diagnoses';
import { ICreatePatientPrimaryDiagnosisDTO } from '../contracts/dtos/create-patient-primary-diagnosis';
import { PatientPrimaryDiagnosis } from '../entities/patient-primary-diagnosis';
import { PostgresDataSource } from '../../../shared/typeorm';

export class PatientPrimaryDiagnosesRepository
  implements IPatientPrimaryDiagnosesRepository
{
  private ormRepository: Repository<PatientPrimaryDiagnosis>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      PatientPrimaryDiagnosis,
    );
  }

  public async findByPatientId(
    patientId: string,
  ): Promise<PatientPrimaryDiagnosis[]> {
    return this.ormRepository.find({
      where: { patientId },
      order: { createdAt: 'desc' },
      relations: ['appointment'],
    });
  }

  public async create(
    primaryDiagnosis: ICreatePatientPrimaryDiagnosisDTO,
  ): Promise<PatientPrimaryDiagnosis> {
    return this.ormRepository.create(primaryDiagnosis);
  }

  public async save(
    primaryDiagnosis: PatientPrimaryDiagnosis,
  ): Promise<PatientPrimaryDiagnosis> {
    return this.ormRepository.save(primaryDiagnosis);
  }
}
