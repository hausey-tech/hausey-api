import { Patient } from '../../entities/patient';
import { ICreatePatientDTO } from '../dtos/create-patient';

export interface IPatientsRepository {
  findByUserId(id: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
  create(payload: ICreatePatientDTO): Promise<Patient>;
  save(patient: Patient): Promise<Patient>;
}
