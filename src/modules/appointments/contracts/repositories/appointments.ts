import { FindOptionsWhere } from 'typeorm';

import { Appointment } from '../../entities/appointment';
import { ICreateAppointmentDTO } from '../dtos/create-appointment';

export interface IAppointmentsRepository {
  findById(id: string): Promise<Appointment | null>;
  softDelete(id: string): Promise<void>;
  create(payload: ICreateAppointmentDTO): Promise<Appointment>;
  save(appointment: Appointment): Promise<Appointment>;
  findBySpecialtyBetweenDates(
    specialtyId: string,
    dates: Date[],
  ): Promise<Appointment[]>;
  find(
    where: FindOptionsWhere<Appointment>,
    page: number,
    perPage: number,
  ): Promise<{ data: Appointment[]; total: number; totalPages: number }>;
  findByProfessional(professionalId: string): Promise<Appointment[]>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  findByPatientAndIsRunning(patientId: string): Promise<Appointment>;
  update(id: string, payload: Appointment): Promise<Appointment>;
  findAllAppointmentsStatusIsAwaiting(): Promise<Appointment[]>;
  findAppointmentStatusIsRunning(): Promise<Appointment[]>;
  findByPatientIdAndDate(patientId: string, date: string): Promise<Appointment>;
  findAppointmentByProfessionalIdAndDate(
    professionalId: string,
    date: string,
  ): Promise<Appointment[]>;
  findByDate(
    date: Date,
    professionalId: string,
    patientId: string,
    status: string,
    country: string,
    page: number,
    perPage: number,
  ): Promise<{ data: Appointment[]; total: number; totalPages: number }>;
}
