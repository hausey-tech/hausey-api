import { Between, Repository, FindOptionsWhere, Not, IsNull } from 'typeorm';

import moment from 'moment-timezone';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Appointment } from '../entities/appointment';
import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';

export class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Appointment);
    this.relations = [
      'patient',
      'patient.address',
      'professional',
      'professional.role',
      'specialty',
      'prescriptions',
      'medicalRecord',
      'medicalRecord.cids',
    ];
  }

  async findAppointmentByProfessionalIdAndDate(
    professionalId: string,
    date: any,
  ): Promise<Appointment[]> {
    const appointment = await this.ormRepository.find({
      where: {
        professionalId,
        date,
      },
    });

    return appointment;
  }

  public async findById(id: string): Promise<Appointment | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  public async create(payload: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      ...payload,
      status: 'awaiting',
    });

    await this.ormRepository.save(appointment);

    return this.ormRepository.findOneOrFail({
      where: { id: appointment.id },
      relations: ['patient'],
    });
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    const updatedAppointment = { ...appointment };
    if (appointment.canceled) {
      updatedAppointment.status = 'canceled';
      updatedAppointment.finished = true;
      return this.ormRepository.save(updatedAppointment);
    }
    return this.ormRepository.save(appointment);
  }

  public async findBySpecialtyBetweenDates(
    specialtyId: string,
    dates: Date[],
  ): Promise<Appointment[]> {
    const initial = dates[0];
    const final = dates[dates.length - 1];

    return this.ormRepository.find({
      where: {
        specialtyId,
        date: Between(initial, final),
      },
    });
  }

  public async find(
    where: FindOptionsWhere<Appointment>,
    page: number,
    perPage: number,
  ): Promise<{ data: Appointment[]; total: number; totalPages: number }> {
    const [data, total] = await this.ormRepository.findAndCount({
      where,
      order: { date: 'asc' },
      relations: this.relations,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(total / perPage);
    return { data, total, totalPages };
  }

  public async findByProfessional(
    professionalId: string,
  ): Promise<Appointment[]> {
    return this.ormRepository.find({
      where: { professionalId },
      order: { date: 'asc' },
      relations: this.relations,
    });
  }

  public async findByDate(
    date: Date,
    professionalId: string,
    status: string,
    country: string,
    page: number,
    perPage: number,
  ): Promise<{ data: Appointment[]; total: number; totalPages: number }> {
    const startOfMonth = moment.utc(date, 'MM/YYYY').startOf('month').toDate();
    const endOfMonth = moment.utc(date, 'MM/YYYY').endOf('month').toDate();

    const [data, total] = await this.ormRepository.findAndCount({
      where: {
        date: Between(startOfMonth, endOfMonth),
        status,
        professionalId,
        patient: {
          address: Not(IsNull()),
        },
      },
      order: { date: 'ASC' },
      take: perPage,
      skip: (page - 1) * perPage,
    });
    let filteredData;
    if (country) {
      filteredData = data.filter(
        appointment => appointment.patient?.address?.country === country,
      );
    } else {
      filteredData = data;
    }
    const totalPages = Math.ceil(total / perPage);
    return { data: filteredData, total, totalPages };
  }

  public async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.ormRepository.find({
      where: { patientId },
      order: { date: 'asc' },
      relations: this.relations,
    });
  }

  public async update(id: string, payload: Appointment): Promise<Appointment> {
    if (payload.canceled) {
      await this.ormRepository.update(id, {
        ...payload,
        status: 'canceled',
        finished: true,
      });
    } else {
      await this.ormRepository.update(id, payload);
    }
    return this.findById(id);
  }

  public async findAllAppointmentsStatusIsAwaiting(): Promise<Appointment[]> {
    return this.ormRepository.find({
      where: {
        status: 'awaiting',
        emergency: true,
      },
    });
  }

  public async findAppointmentStatusIsRunning(): Promise<Appointment[]> {
    return this.ormRepository.find({
      where: {
        status: 'running',
        emergency: true,
      },
    });
  }
}
