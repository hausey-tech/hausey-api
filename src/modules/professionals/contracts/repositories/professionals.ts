import { Professional } from '../../entities';

export interface IProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(id: string): Promise<Professional | null>;
  findBySpecialtyId(id: string): Promise<Professional[]>;
}
