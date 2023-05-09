import { Patient } from '../../entities/patient';
import { ICreatePatientDTO } from '../dtos/create-patient';
import { IUpdatePatientDTO } from '../dtos/update-patient';

export interface IPatientsRepository {
  find(): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
  findByIds(ids: string[]): Promise<Patient[]>;
  findByEmail(email: string): Promise<Patient | null>;
  findByEmailWithDeleted(email: string): Promise<Patient | null>;
  findByDocument(document: string): Promise<Patient | null>;
  findByCustomerId(customerId: string): Promise<Patient | null>;
  restore(id: string, payload: ICreatePatientDTO): Promise<Patient>;
  create(payload: ICreatePatientDTO): Promise<Patient>;
  save(patient: Patient): Promise<Patient>;
  update(id: string, payload: IUpdatePatientDTO): Promise<Patient>;
}
