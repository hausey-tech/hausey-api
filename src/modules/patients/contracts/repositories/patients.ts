import { Patient } from '../../entities/patient';
import { ICreatePatientDTO } from '../dtos/create-patient';

export interface IPatientsRepository {
  findById(id: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  create(payload: ICreatePatientDTO): Promise<Patient>;
  save(patient: Patient): Promise<Patient>;
}
