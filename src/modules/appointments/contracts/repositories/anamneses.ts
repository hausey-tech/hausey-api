import { Anamnesis } from '../../entities/anamnesis';
import { ICreateAnamnesisDTO } from '../dtos/create-anamnesis';

export interface IAnamnesesRepository {
  create(anamnesis: ICreateAnamnesisDTO): Promise<Anamnesis>;
  save(anamnesis: Anamnesis): Promise<Anamnesis>;
  update(id: string, description: string): Promise<Anamnesis>;
  findById(id: string): Promise<Anamnesis>;
}
