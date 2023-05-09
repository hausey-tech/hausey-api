import { PatientProgram } from '../../entities/patient-program';

export interface IPatientProgramsRepository {
  findByPatientId(patientId: string): Promise<PatientProgram[]>;
}
