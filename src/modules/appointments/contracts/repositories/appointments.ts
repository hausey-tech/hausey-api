import { Appointments } from '../../entities';

export interface IAppointmentsRepository {
  findById(id: string): Promise<Appointments | null>;
  softDelete(id: string): Promise<void>;
}
