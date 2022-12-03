import { Repository } from 'typeorm';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Appointment } from '../entities/appointment';
import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';

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

  public async create(payload: ICreateAppointmentDTO): Promise<Appointment> {
    return this.ormRepository.create(payload);
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    return this.ormRepository.save(appointment);
  }
}
