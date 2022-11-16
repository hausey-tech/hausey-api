import { Repository } from 'typeorm';

import { IAppointmentsRepository } from '../contracts';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Appointment } from '../entities';

export class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Appointment);
  }

  public async findById(id: string): Promise<Appointment | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
