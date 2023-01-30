import { Specialty } from '../../entities/specialty';
import { ICreateSpecialtyDTO } from '../dtos/create-specialty';

export interface ISpecialtiesRepository {
  findAll(): Promise<Specialty[]>;
  findById(id: string): Promise<Specialty>;
  findByIds(ids: string[]): Promise<Specialty[]>;
  create(specialty: ICreateSpecialtyDTO): Promise<Specialty>;
  save(specialty: Specialty): Promise<Specialty>;
  findByMemedId(memedId: number): Promise<Specialty>;
}
