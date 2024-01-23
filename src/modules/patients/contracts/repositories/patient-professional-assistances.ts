import { PatientProfessionalAssistance } from '../../entities/patient-professional-assistance';
import { ICreatePatientProfessionalAssistanceDto } from '../dtos/create-patient-professional-assistance';

export interface IPatientProfessionalAssistancesRepository {
  find(): Promise<PatientProfessionalAssistance[]>;
  findById(id: string): Promise<PatientProfessionalAssistance | null>;
  findByIds(ids: string[]): Promise<PatientProfessionalAssistance[]>;
  create(
    payload: ICreatePatientProfessionalAssistanceDto,
  ): Promise<PatientProfessionalAssistance>;
  save(
    patient: PatientProfessionalAssistance,
  ): Promise<PatientProfessionalAssistance>;
}
