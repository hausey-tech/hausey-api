import { MedicalRecordCid } from '../../entities/medical-record-cid';

export interface IMedicalRecordCidsRepository {
  create(payload: { cid: string }): Promise<MedicalRecordCid>;
  save(medicalRecordCid: MedicalRecordCid): Promise<MedicalRecordCid>;
}
