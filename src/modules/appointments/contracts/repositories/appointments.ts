import { Appointment } from '../../entities/appointment';

export interface IAppointmentsRepository {
  findById(id: string): Promise<Appointment | null>;
  softDelete(id: string): Promise<void>;
}
