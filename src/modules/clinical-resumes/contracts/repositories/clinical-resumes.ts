import { FindOptionsWhere } from 'typeorm';
import { ClinicalResume } from '../../entities/clinical-resume';
import { ICreateClinicalResumeDto } from '../dtos/create-clinical-resume';

export interface IClinicalResumesRepository {
  find(where: FindOptionsWhere<ClinicalResume>): Promise<ClinicalResume[]>;
  findByPatientId(patientId: string): Promise<ClinicalResume | null>;
  findById(id: string): Promise<ClinicalResume | null>;
  findByProfessionalId(
    professionalId: string,
  ): Promise<ClinicalResume[] | null>;
  create(payload: ICreateClinicalResumeDto): Promise<ClinicalResume>;
  save(patient: ClinicalResume): Promise<ClinicalResume>;
}
