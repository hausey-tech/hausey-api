import { Repository, In, Raw } from 'typeorm';

import { ISlotsRepository } from '../contracts/repositories/slots';
import { ICreateDBSlotDTO } from '../contracts/dtos/create-db-slot';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Slot } from '../entities/slot';

export class SlotsRepository implements ISlotsRepository {
  private ormRepository: Repository<Slot>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Slot);
    this.relations = ['professional'];
  }

  public async find(): Promise<Slot[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<Slot> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByProfessionalIds(ids: string[]): Promise<Slot[]> {
    return this.ormRepository.find({ where: { professionalId: In(ids) } });
  }

  public async findByTodayDate(): Promise<Slot[]> {
    const now = new Date(Date.now());

    const targetDate = now.toISOString().split('T')[0];
    const currentHour = now.toTimeString().split(' ')[0];
    return this.ormRepository.find({
      where: [
        {
          date: Raw(alias => `DATE(${alias}) = :targetDate`, { targetDate }),
          startTime: Raw(alias => `${alias} <= :currentHour`, { currentHour }),
          endTime: Raw(alias => `${alias} >= :currentHour`, { currentHour }),
        },
      ],
      relations: [...this.relations, 'professional'],
    });
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

  public async delete(id: string): Promise<Slot> {
    await this.ormRepository.softDelete(id);
    return this.findById(id);
  }
}
