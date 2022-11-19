import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPatientProgramsRepository } from '../contracts/repositories/patient-programs';
import { PatientProgram } from '../entities/patient-program';

export class PatientProgramsRepository implements IPatientProgramsRepository {
  private ormRepository: Repository<PatientProgram>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientProgram);
  }

  public async findByPatientId(patientId: string): Promise<PatientProgram[]> {
    return this.ormRepository.find({ where: { patientId } });
  }
}
