import { IHashProvider } from '../../../src/shared/providers/HashProvider/entities/hash-provider';

export class HashProvider implements IHashProvider {
  generateHash(): Promise<string> {
    return new Promise(resolve => resolve('hash'));
  }

  compareHash(): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }
}
