import { container } from 'tsyringe';

import { IHashProvider } from './HashProvider/entities';
import { BcryptHashProvider } from './HashProvider/implementations';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
