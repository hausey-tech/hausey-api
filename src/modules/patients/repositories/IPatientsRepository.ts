import Patient from '../entities/Patient';

export default interface IPatientsRepository {
  findByUserId(id: string): Promise<Patient | null>;
}
