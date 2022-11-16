import { Appointment } from '../../entities';

export interface IAppointmentsRepository {
  findById(id: string): Promise<Appointment | null>;
  softDelete(id: string): Promise<void>;
}
