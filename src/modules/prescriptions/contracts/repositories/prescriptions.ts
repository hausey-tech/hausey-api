import { Prescription } from '../../entities/prescription';
import { ICreatePrescriptionDTO } from '../dtos/create-prescription';

export interface IPrescriptionsRepository {
  findByExternalId(externalId: number): Promise<Prescription>;
  create(payload: ICreatePrescriptionDTO): Promise<Prescription>;
  save(prescription: Prescription): Promise<Prescription>;
  delete(id: string): Promise<void>;
}
