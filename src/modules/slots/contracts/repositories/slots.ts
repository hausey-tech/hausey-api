import { Slot } from '../../entities/slot';
import { ICreateDBSlotDTO } from '../dtos/create-db-slot';

export interface ISlotsRepository {
  find(): Promise<Slot[]>;
  findById(id: string): Promise<Slot>;
  findByProfessionalIds(ids: string[]): Promise<Slot[]>;
  findByProfessionalId(id: string): Promise<Slot[]>;
  findByTodayDate(): Promise<Slot[]>;
  create(payload: ICreateDBSlotDTO): Promise<Slot>;
  save(sloat: Slot): Promise<Slot>;
  delete(id: string): Promise<Slot>;
  findValidSlots({
    date,
    appointmentTime,
  }: {
    date: string;
    appointmentTime: string;
  }): Promise<Slot[]>;
}
