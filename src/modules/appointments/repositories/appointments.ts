import { Between, Repository } from 'typeorm';

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

  public async findByTypeBetweenDates(
    typeId: string,
    dates: Date[],
  ): Promise<Appointment[]> {
    const initial = dates[0];
    const final = dates[dates.length - 1];

    return this.ormRepository.find({
      where: { date: Between(initial, final), professionalTypeId: typeId },
    });
  }

  public async findBySpecialtyBetweenDates(
    specialtyId: string,
    dates: Date[],
  ): Promise<Appointment[]> {
    const initial = dates[0];
    const final = dates[dates.length - 1];

    return this.ormRepository.find({
      where: {
        date: Between(initial, final),
        professionalSpecialtyId: specialtyId,
      },
    });
  }
}
