import { container } from 'tsyringe';

import { IHashProvider } from './HashProvider/entities/hash-provider';
import { BcryptHashProvider } from './HashProvider/implementations/bcrypt-hash-provider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
