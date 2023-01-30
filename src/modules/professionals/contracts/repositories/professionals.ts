import { Professional } from '../../entities/professional';
import { ICreateProfessionalDTO } from '../dtos/create-professional';

export interface IProfessionalsRepository {
  findById(id: string): Promise<Professional | null>;
  findByEmail(email: string): Promise<Professional | null>;
  find(): Promise<Professional[]>;
  create(
    payload: Omit<ICreateProfessionalDTO, 'specialties'>,
  ): Promise<Professional>;
  save(professional: Professional): Promise<Professional>;
}
