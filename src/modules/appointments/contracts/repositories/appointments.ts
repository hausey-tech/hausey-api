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
  find(where: FindOptionsWhere<Appointment>): Promise<Appointment[]>;
  findByProfessional(professionalId: string): Promise<Appointment[]>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  update(id: string, payload: Appointment): Promise<Appointment>;
  findAllAppointmentsStatusIsAwaiting(): Promise<Appointment[]>;
  findAppointmentStatusIsRunning(): Promise<Appointment[]>;
}
