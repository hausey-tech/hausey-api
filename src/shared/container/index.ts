import { container } from 'tsyringe';

import '../providers';

import { IUsersRepository } from '../../modules/users/contracts/repositories/users';
import { UsersRepository } from '../../modules/users/repositories/users-repository';

import { IProfessionalsRepository } from '../../modules/professionals/contracts/repositories/professionals';
import { ProfessionalsRepository } from '../../modules/professionals/repositories/professionals-repository';

import { ISpecialtiesRepository } from '../../modules/professionals/contracts/repositories/specialties';
import { SpecialtiesRepository } from '../../modules/professionals/repositories/specialties';

import { IPatientsRepository } from '../../modules/patients/contracts/repositories/patients';
import { PatientsRepository } from '../../modules/patients/repositories/patients-repository';

import { IAppointmentsRepository } from '../../modules/appointments/contracts/repositories/appointments';
import { AppointmentsRepository } from '../../modules/appointments/repositories/appointments';

import { ISlotsRepository } from '../../modules/appointments/contracts/repositories/slots';
import { SlotsRepository } from '../../modules/appointments/repositories/slots';

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

container.registerSingleton<ISpecialtiesRepository>(
  'SpecialtiesRepository',
  SpecialtiesRepository,
);
