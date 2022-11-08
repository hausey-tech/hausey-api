import Patient from '../infra/typeorm/entities/Patient';

export default interface IPatientsRepository {
  findByUserId(id: string): Promise<Patient | null>;
}
