import { MedicalRecord } from '../../entities/medical-record';

export interface IMedicalRecordsRepository {
  create(payload: {
    description: string;
    restricted?: boolean;
  }): Promise<MedicalRecord>;
  save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
}
