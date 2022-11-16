import { Slot } from '../../entities';
import { ICreateSlotDTO } from '../dtos/create-slot';

export interface ISlotsRepository {
  findByProfessionalId(ids: string[]): Promise<Slot[]>;
  create(payload: ICreateSlotDTO): Promise<Slot>;
  save(sloat: Slot): Promise<Slot>;
}
