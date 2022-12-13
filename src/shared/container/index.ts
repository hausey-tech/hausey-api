import { container } from 'tsyringe';

import '../providers';

import { IUsersRepository } from '../../modules/users/contracts/repositories/users';
import { UsersRepository } from '../../modules/users/repositories/users';

import { IProfessionalsRepository } from '../../modules/professionals/contracts/repositories/professionals';
import { ProfessionalsRepository } from '../../modules/professionals/repositories/professionals';

import { IProfessionalSpecialtiesRepository } from '../../modules/professionals/contracts/repositories/professional-specialties';
import { ProfessionalSpecialtiesRepository } from '../../modules/professionals/repositories/professional-specialties';

import { IProfessionalTypesRepository } from '../../modules/professionals/contracts/repositories/professional-types';
import { ProfessionalTypesRepository } from '../../modules/professionals/repositories/professional-types';

import { IPatientsRepository } from '../../modules/patients/contracts/repositories/patients';
import { PatientsRepository } from '../../modules/patients/repositories/patients';

import { IPatientProgramsRepository } from '../../modules/patients/contracts/repositories/patient-programs';
import { PatientProgramsRepository } from '../../modules/patients/repositories/patient-programs';

import { IPatientAnamnesesRepository } from '../../modules/patients/contracts/repositories/patient-anamneses';
import { PatientAnamnesesRepository } from '../../modules/patients/repositories/patient-anamneses';

import { IAppointmentsRepository } from '../../modules/appointments/contracts/repositories/appointments';
import { AppointmentsRepository } from '../../modules/appointments/repositories/appointments';

import { ISlotsRepository } from '../../modules/appointments/contracts/repositories/slots';
import { SlotsRepository } from '../../modules/appointments/repositories/slots';

import { IProgramsRepository } from '../../modules/programs/contracts/repositories/programs';
import { ProgramsRepository } from '../../modules/programs/repositories/programs';

import { IProgramProfessionalTypeDiscountsRepository } from '../../modules/programs/contracts/repositories/program-professional-type-discounts';
import { ProgramProfessionalTypeDiscountsRepository } from '../../modules/programs/repositories/program-professional-type-discounts';

import { IProgramProfessionalSpecialtyDiscountsRepository } from '../../modules/programs/contracts/repositories/program-professional-specialty-discounts';
import { ProgramProfessionalSpecialtyDiscountsRepository } from '../../modules/programs/repositories/program-professional-specialty-discounts';

import { IPlansRepository } from '../../modules/plans/contracts/repositories/plans';
import { PlansRepository } from '../../modules/plans/repositories/plans';

import { IPlanProfessionalTypeDiscountsRepository } from '../../modules/plans/contracts/repositories/plan-professional-type-discounts';
import { PlanProfessionalTypeDiscountsRepository } from '../../modules/plans/repositories/plan-professional-type-discounts';

import { IPlanProfessionalSpecialtyDiscountsRepository } from '../../modules/plans/contracts/repositories/plan-professional-specialty-discounts';
import { PlanProfessionalSpecialtyDiscountsRepository } from '../../modules/plans/repositories/plan-professional-specialty-discounts';

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

container.registerSingleton<IPatientProgramsRepository>(
  'PatientProgramsRepository',
  PatientProgramsRepository,
);

container.registerSingleton<IPatientAnamnesesRepository>(
  'PatientAnamnesesRepository',
  PatientAnamnesesRepository,
);

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<ISlotsRepository>(
  'SlotsRepository',
  SlotsRepository,
);

container.registerSingleton<IProfessionalSpecialtiesRepository>(
  'ProfessionalSpecialtiesRepository',
  ProfessionalSpecialtiesRepository,
);

container.registerSingleton<IProfessionalTypesRepository>(
  'ProfessionalTypesRepository',
  ProfessionalTypesRepository,
);

container.registerSingleton<IProgramsRepository>(
  'ProgramsRepository',
  ProgramsRepository,
);

container.registerSingleton<IProgramProfessionalTypeDiscountsRepository>(
  'ProgramProfessionalTypeDiscountsRepository',
  ProgramProfessionalTypeDiscountsRepository,
);

container.registerSingleton<IProgramProfessionalSpecialtyDiscountsRepository>(
  'ProgramProfessionalSpecialtyDiscountsRepository',
  ProgramProfessionalSpecialtyDiscountsRepository,
);

container.registerSingleton<IPlansRepository>(
  'PlansRepository',
  PlansRepository,
);

container.registerSingleton<IPlanProfessionalTypeDiscountsRepository>(
  'PlanProfessionalTypeDiscountsRepository',
  PlanProfessionalTypeDiscountsRepository,
);

container.registerSingleton<IPlanProfessionalSpecialtyDiscountsRepository>(
  'PlanProfessionalSpecialtyDiscountsRepository',
  PlanProfessionalSpecialtyDiscountsRepository,
);
