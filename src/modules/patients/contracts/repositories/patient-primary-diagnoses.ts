import { PatientPrimaryDiagnosis } from '../../entities/patient-primary-diagnosis';
import { ICreatePatientAnamnesisDTO } from '../dtos/create-patient-anamnesis';

export interface IPatientPrimaryDiagnosesRepository {
  findByPatientId(patientId: string): Promise<PatientPrimaryDiagnosis[]>;
  create(
    primaryDiagnosis: ICreatePatientAnamnesisDTO,
  ): Promise<PatientPrimaryDiagnosis>;
  save(
    primaryDiagnosis: PatientPrimaryDiagnosis,
  ): Promise<PatientPrimaryDiagnosis>;
}
