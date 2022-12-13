import { PatientAnamnesis } from '../../entities/patient-anamnesis';
import { ICreatePatientAnamnesisDTO } from '../dtos/create-patient-anamnesis';

export interface IPatientAnamnesesRepository {
  findByPatientId(patientId: string): Promise<PatientAnamnesis[]>;
  create(
    patientAnamnesis: ICreatePatientAnamnesisDTO,
  ): Promise<PatientAnamnesis>;
  save(patientAnamnesis: PatientAnamnesis): Promise<PatientAnamnesis>;
}
