import { container } from 'tsyringe';
import '../providers';

import UsersRepository from '../../modules/users/repositories/UsersRepository';
import IUsersRepository from '../../modules/users/repositories/IUsersRepository';

import IProfessionalsRepository from '../../modules/professionals/repositories/IProfessionalsRepository';
import ProfessionalsRepository from '../../modules/professionals/repositories/ProfessionalsRepository';

import IPatientsRepository from '../../modules/patients/repositories/IPatientsRepository';
import PatientsRepository from '../../modules/patients/repositories/PatientsRepository';

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
