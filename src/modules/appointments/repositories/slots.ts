import { Repository, In } from 'typeorm';

import { ISlotsRepository, ICreateSlotDTO } from '../contracts';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Slot } from '../entities';

export class SlotsRepository implements ISlotsRepository {
  private ormRepository: Repository<Slot>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Slot);
  }

  public async findByProfessionalId(ids: string[]): Promise<Slot[]> {
    return this.ormRepository.find({ where: { professionalId: In(ids) } });
  }

  public async create(payload: ICreateSlotDTO): Promise<Slot> {
    return this.ormRepository.create(payload);
  }

  public async save(slot: Slot): Promise<Slot> {
    return this.ormRepository.save(slot);
  }
}
