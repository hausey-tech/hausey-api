import { hash, compare } from 'bcryptjs';
import { IHashProvider } from '../entities/hash-provider';

export class BcryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 12);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
