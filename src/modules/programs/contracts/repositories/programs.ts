import { Program } from '../../entities/program';

export interface IProgramsRepository {
  findAll(): Promise<Program[]>;
}
