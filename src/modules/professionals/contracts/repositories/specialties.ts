import { Specialty } from '../../entities/specialty';
import { CreateSpecialtyDTO } from '../dtos/create-specialty';

export interface ISpecialtiesRepository {
  findAll(): Promise<Specialty[]>;
  findById(id: string): Promise<Specialty>;
  create(specialty: CreateSpecialtyDTO): Promise<Specialty>;
  save(specialty: Specialty): Promise<Specialty>;
  findByMemedId(memedId: number): Promise<Specialty>;
}
