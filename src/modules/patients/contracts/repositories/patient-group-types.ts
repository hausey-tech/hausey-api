import { PatientGroupType } from '../../entities/patient-group-type';
import { ICreatePatientGroupTypeDto } from '../dtos/create-patient-group-type';

export interface IPatientGroupTypesRepository {
  find(): Promise<PatientGroupType[]>;
  findById(id: string): Promise<PatientGroupType | null>;
  findByIds(ids: string[]): Promise<PatientGroupType[]>;
  findByGroupTypeIds(ids: string[]): Promise<PatientGroupType[] | null>;
  create(payload: ICreatePatientGroupTypeDto): Promise<PatientGroupType>;
  save(patient: PatientGroupType): Promise<PatientGroupType>;
  delete(patientGroupTypeId: string): Promise<void>;
}
