import { Patient } from '../../entities';

export interface IPatientsRepository {
  findByUserId(id: string): Promise<Patient | null>;
}
