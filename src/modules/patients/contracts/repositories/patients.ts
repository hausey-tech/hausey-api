import { Patient } from '../../entities/patient';

export interface IPatientsRepository {
  findByUserId(id: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
}
