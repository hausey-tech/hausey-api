import { Prescription } from '../../entities/Prescription';
import { ICreatePrescriptionDTO } from '../dtos/ICreatePrescriptionDTO';

export interface IPrescriptionsRepository {
  findByExternalId(externalId: number): Promise<Prescription>;
  create(payload: ICreatePrescriptionDTO): Promise<Prescription>;
  save(prescription: Prescription): Promise<Prescription>;
  delete(id: string): Promise<void>;
}
