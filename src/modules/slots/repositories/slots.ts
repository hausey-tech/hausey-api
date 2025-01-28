import { Repository, In, Raw, IsNull } from 'typeorm';

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

  public async findByTodayDate(date?: Date): Promise<Slot[]> {
    let patientDateTime: Date;
    console.log('date', date);
    if (date) {
      patientDateTime = date;
      patientDateTime.setHours(patientDateTime.getHours() - 3);
    }
    patientDateTime = new Date(Date.now());
    patientDateTime.setHours(patientDateTime.getHours() - 3);
    console.log('Trated date', patientDateTime);

    console.log('new Date', patientDateTime);

    const patientISODateTime = patientDateTime.toISOString();

    return this.ormRepository.find({
      where: [
        {
          startTime: Raw(alias => `${alias} <= :patientDateTime`, {
            patientDateTime: patientISODateTime,
          }),
          endTime: Raw(alias => `${alias} >= :patientDateTime`, {
            patientDateTime: patientISODateTime,
          }),
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

  // Implementação do método findValidSlots
  public async findValidSlots({
    date,
    appointmentTime,
  }: {
    date: string;
    appointmentTime: string;
  }): Promise<Slot[]> {
    return this.ormRepository.find({
      where: {
        date: Raw(alias => `DATE(${alias}) = DATE(:date)`, { date }),
        startTime: Raw(alias => `TIME(${alias}) <= TIME(:appointmentTime)`, {
          appointmentTime,
        }),
        endTime: Raw(alias => `TIME(${alias}) >= TIME(:appointmentTime)`, {
          appointmentTime,
        }),
        deletedAt: IsNull(),
      },
      relations: [...this.relations, 'professional'],
    });
  }
}
