import { Repository, In } from 'typeorm';

import { ISlotsRepository } from '../contracts/repositories/slots';
import { ICreateDBSlotDTO } from '../contracts/dtos/create-db-slot';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Slot } from '../entities/slot';

export class SlotsRepository implements ISlotsRepository {
  private ormRepository: Repository<Slot>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Slot);
  }

  public async findByProfessionalIds(ids: string[]): Promise<Slot[]> {
    return this.ormRepository.find({ where: { professionalId: In(ids) } });
  }

  public async findByProfessionalId(id: string): Promise<Slot[]> {
    return this.ormRepository.find({ where: { professionalId: id } });
  }

  public async create(payload: ICreateDBSlotDTO): Promise<Slot> {
    return this.ormRepository.create(payload);
  }

  public async save(slot: Slot): Promise<Slot> {
    return this.ormRepository.save(slot);
  }
}
