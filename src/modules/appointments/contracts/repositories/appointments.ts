import { Appointment } from '../../entities/appointment';
import { ICreateAppointmentDTO } from '../dtos/create-appointment';

export interface IAppointmentsRepository {
  findById(id: string): Promise<Appointment | null>;
  softDelete(id: string): Promise<void>;
  create(payload: ICreateAppointmentDTO): Promise<Appointment>;
  save(appointment: Appointment): Promise<Appointment>;
}
