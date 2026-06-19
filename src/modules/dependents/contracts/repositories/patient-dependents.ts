import { PatientDependent } from '../../entities/patient-dependent';

export interface IPatientDependentsRepository {
  findById(id: string): Promise<PatientDependent | null>;
  findByHolderId(holderId: string): Promise<PatientDependent[]>;
  findByDependentPatientId(
    dependentPatientId: string,
  ): Promise<PatientDependent | null>;
  findActiveByHolderId(holderId: string): Promise<PatientDependent[]>;
  findPendingByEmail(email: string): Promise<PatientDependent[]>;
  findByInviteToken(token: string): Promise<PatientDependent | null>;
  countActiveByHolderId(holderId: string): Promise<number>;
  create(data: Partial<PatientDependent>): Promise<PatientDependent>;
  save(dependent: PatientDependent): Promise<PatientDependent>;
  softDelete(id: string): Promise<void>;
}
