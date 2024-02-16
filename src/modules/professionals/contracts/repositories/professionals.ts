import { Professional } from '../../entities/professional';
import { ICreateProfessionalDTO } from '../dtos/create-professional';

export interface IProfessionalsRepository {
  find(): Promise<Professional[]>;
  findById(id: string): Promise<Professional | null>;
  findByIds(ids: string[]): Promise<Professional[]>;
  findByRoleId(roleId: string): Promise<Professional[]>;
  findByEmail(email: string): Promise<Professional | null>;
  findByDocument(document: string): Promise<Professional | null>;
  create(
    payload: Omit<ICreateProfessionalDTO, 'specialties'>,
  ): Promise<Professional>;
  save(professional: Professional): Promise<Professional>;
}
