import { Repository } from 'typeorm';

import { IPrescriptionsRepository } from '../contracts/repositories/IPrescriptionsRepository';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Prescription } from '../entities/PrescriptionA';
import { ICreatePrescriptionDTO } from '../contracts/dtos/ICreatePrescriptionDTO';

export class PrescriptionsRepository implements IPrescriptionsRepository {
  private ormRepository: Repository<Prescription>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Prescription);
  }

  public async findByExternalId(externalId: number): Promise<Prescription> {
    return this.ormRepository.findOne({ where: { externalId } });
  }

  public async create(payload: ICreatePrescriptionDTO): Promise<Prescription> {
    return this.ormRepository.create(payload);
  }

  public async save(prescription: Prescription): Promise<Prescription> {
    return this.ormRepository.save(prescription);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
