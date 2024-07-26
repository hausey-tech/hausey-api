import { PatientProfessionalAssistance } from '../../entities/patient-professional-assistance';
import { ICreatePatientProfessionalAssistanceDto } from '../dtos/create-patient-professional-assistance';

export interface IPatientProfessionalAssistancesRepository {
  find(): Promise<PatientProfessionalAssistance[]>;
  findById(id: string): Promise<PatientProfessionalAssistance | null>;
  findByIds(ids: string[]): Promise<PatientProfessionalAssistance[]>;
  findByPatientRoleAndSpecialty(
    patientId: string,
    roleId: string,
    specialtyId?: string,
  ): Promise<PatientProfessionalAssistance | null>;
  create(
    payload: ICreatePatientProfessionalAssistanceDto,
  ): Promise<PatientProfessionalAssistance>;
  update(
    profAssistanceId: string,
    payload: PatientProfessionalAssistance,
  ): Promise<PatientProfessionalAssistance>;
  save(
    patient: PatientProfessionalAssistance,
  ): Promise<PatientProfessionalAssistance>;
}
