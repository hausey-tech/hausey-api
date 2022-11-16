import { Slot } from '../../entities';

export interface ISlotsRepository {
  findByProfessionalId(ids: string[]): Promise<Slot[]>;
}
