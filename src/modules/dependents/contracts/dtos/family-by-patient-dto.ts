import { Patient } from '../../../patients/entities/patient';
import { PatientDependent } from '../../entities/patient-dependent';

export type FamilyRole = 'holder' | 'dependent';

export interface IFamilyByPatientDTO {
  role: FamilyRole;
  holder: Patient | null;
  members: PatientDependent[];
}
