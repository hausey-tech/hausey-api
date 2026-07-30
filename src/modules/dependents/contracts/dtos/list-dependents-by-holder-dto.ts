import { PatientDependent } from '../../entities/patient-dependent';

export interface IDependentByHolderDTO {
  id: string;
  holderId: string;
  dependentPatientId: string | null;
  dependentPatient: PatientDependent['dependentPatient'];
  hasAppAccess: boolean;
  name: string | null;
  birthdate: string | null;
  cpf: string | null;
  email: string | null;
  status: PatientDependent['status'];
  createdAt: Date;
  updatedAt: Date;
}
