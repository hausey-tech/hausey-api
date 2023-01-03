import { Anamnesis } from '../../entities/anamnesis';
import { ICreateAnamnesisDTO } from '../dtos/create-anamnesis';

export interface IAnamnesesRepository {
  create(anamnesis: ICreateAnamnesisDTO): Promise<Anamnesis>;
  save(anamnesis: Anamnesis): Promise<Anamnesis>;
}
