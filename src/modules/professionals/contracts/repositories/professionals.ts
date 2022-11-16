import { Professional } from '../../entities';

export interface IProfessionalsRepository {
  findByUserId(id: string): Promise<Professional | null>;
  findBySpecialtyId(id: string): Promise<Professional[]>;
}
