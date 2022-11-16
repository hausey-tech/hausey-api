import { container } from 'tsyringe';

import '../providers';

import { IUsersRepository } from '../../modules/users/contracts';
import { UsersRepository } from '../../modules/users/repositories';

import { IProfessionalsRepository } from '../../modules/professionals/contracts';
import { ProfessionalsRepository } from '../../modules/professionals/repositories';

import { IPatientsRepository } from '../../modules/patients/contracts';
import { PatientsRepository } from '../../modules/patients/repositories';

import {
  IAppointmentsRepository,
  ISlotsRepository,
} from '../../modules/appointments/contracts';
import {
  AppointmentsRepository,
  SlotsRepository,
} from '../../modules/appointments/repositories';

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

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<ISlotsRepository>(
  'SlotsRepository',
  SlotsRepository,
);
