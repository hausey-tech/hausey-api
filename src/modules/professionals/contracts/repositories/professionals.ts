import { FindOptionsWhere } from 'typeorm';
import { Professional } from '../../entities/professional';
import { ICreateProfessionalDTO } from '../dtos/create-professional';
import { IUpdateProfessionalDTO } from '../dtos/update-professional';

export interface IProfessionalsRepository {
  find(where: FindOptionsWhere<Professional>): Promise<Professional[]>;
  findById(id: string): Promise<Professional | null>;
  findByIds(ids: string[]): Promise<Professional[]>;
  findByRoleId(roleId: string): Promise<Professional[]>;
  findByRoleIds(roleIds: string[]): Promise<Professional[]>;
  findByEmail(email: string): Promise<Professional | null>;
  findByDocument(document: string): Promise<Professional | null>;
  create(
    payload: Omit<ICreateProfessionalDTO, 'specialties'>,
  ): Promise<Professional>;
  save(professional: Professional): Promise<Professional>;
  update(id: string, payload: IUpdateProfessionalDTO): Promise<Professional>;
  delete(id: string): Promise<Professional>;
}
