import { Professional } from '../../entities/professional';

export interface IProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(id: string): Promise<Professional | null>;
  findBySpecialtyId(id: string): Promise<Professional[]>;
  findByTypeId(id: string): Promise<Professional[]>;
}
