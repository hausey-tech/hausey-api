import { Secretary } from '../../entities/secretary';

export interface ISecretariesRepository {
  find(): Promise<Secretary[]>;
  findById(id: string): Promise<Secretary | null>;
  findByEmail(email: string): Promise<Secretary | null>;
}
