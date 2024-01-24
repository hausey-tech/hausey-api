import { MedicalRecord } from '../../entities/medical-record';

export interface IMedicalRecordsRepository {
  create(payload: { description: string }): Promise<MedicalRecord>;
  save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
}
