import { Professional } from '../../entities/professional';
import { ICreateProfessionalDTO } from '../dtos/create-professional';

export interface IProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByUserId(id: string): Promise<Professional | null>;
  findBySpecialtyId(id: string): Promise<Professional[]>;
  findByTypeId(id: string): Promise<Professional[]>;
  find(): Promise<Professional[]>;
  create(payload: ICreateProfessionalDTO): Promise<Professional>;
  save(professional: Professional): Promise<Professional>;
}
