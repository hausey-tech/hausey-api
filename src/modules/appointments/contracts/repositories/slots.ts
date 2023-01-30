import { Slot } from '../../entities/slot';
import { ICreateDBSlotDTO } from '../dtos/create-db-slot';

export interface ISlotsRepository {
  findByProfessionalId(ids: string[]): Promise<Slot[]>;
  create(payload: ICreateDBSlotDTO): Promise<Slot>;
  save(sloat: Slot): Promise<Slot>;
}
