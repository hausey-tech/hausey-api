import { PatientGroup } from '../../entities/patient-group';
import { ICreatePatientGroupDto } from '../dtos/create-patient-group';

export interface IPatientGroupsRepository {
  find(): Promise<PatientGroup[]>;
  findById(id: string): Promise<PatientGroup | null>;
  findByIds(ids: string[]): Promise<PatientGroup[]>;
  create(payload: ICreatePatientGroupDto): Promise<PatientGroup>;
  save(patient: PatientGroup): Promise<PatientGroup>;
}
