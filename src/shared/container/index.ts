import { container } from 'tsyringe';
import '../infra/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IProfessionalsRepository from '@modules/professionals/repositories/IProfessionalsRepository';
import ProfessionalsRepository from '@modules/professionals/infra/typeorm/repositories/ProfessionalsRepository';

import IPatientsRepository from '@modules/patients/repositories/IPatientsRepository';
import PatientsRepository from '@modules/patients/infra/typeorm/repositories/PatientsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IProfessionalsRepository>(
  'ProfessionalsRepository',
  ProfessionalsRepository,
);

container.registerSingleton<IPatientsRepository>(
  'PatientsRepository',
  PatientsRepository,
);
