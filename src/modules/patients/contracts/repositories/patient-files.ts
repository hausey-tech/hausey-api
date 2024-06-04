import { PatientFiles } from '../../entities/patient-files';
import { ICreatePatientFileDto } from '../dtos/create-patient-file';

export interface IPatientFilesRepository {
  find(): Promise<PatientFiles[]>;
  findById(id: string): Promise<PatientFiles | null>;
  findByPatientId(patientId: string): Promise<PatientFiles[]>;
  findByIds(ids: string[]): Promise<PatientFiles[]>;
  create(payload: ICreatePatientFileDto): Promise<PatientFiles>;
  save(patient: PatientFiles): Promise<PatientFiles>;
}
