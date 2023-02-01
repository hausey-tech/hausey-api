import { container } from 'tsyringe';

import '../providers';

import { IAddressesRepository } from '../../modules/addresses/contracts/repositories/addresses';
import { AddressesRepository } from '../../modules/addresses/repositories/addresses';

import { IProfessionalsRepository } from '../../modules/professionals/contracts/repositories/professionals';
import { ProfessionalsRepository } from '../../modules/professionals/repositories/professionals';

import { ISpecialtiesRepository } from '../../modules/specialties/contracts/repositories/specialties';
import { SpecialtiesRepository } from '../../modules/specialties/repositories/specialties';

import { IProfessionalSpecialtiesRepository } from '../../modules/professionals/contracts/repositories/professional-specialties';
import { ProfessionalSpecialtiesRepository } from '../../modules/professionals/repositories/professional-specialties';

import { IPatientsRepository } from '../../modules/patients/contracts/repositories/patients';
import { PatientsRepository } from '../../modules/patients/repositories/patients';

import { IPatientProgramsRepository } from '../../modules/patients/contracts/repositories/patient-programs';
import { PatientProgramsRepository } from '../../modules/patients/repositories/patient-programs';

import { IAnamnesesRepository } from '../../modules/appointments/contracts/repositories/anamneses';
import { AnamnesesRepository } from '../../modules/appointments/repositories/anamneses';

import { IPrimaryDiagnosesRepository } from '../../modules/appointments/contracts/repositories/primary-diagnoses';
import { PrimaryDiagnosesRepository } from '../../modules/appointments/repositories/primary-diagnoses';

import { IAppointmentsRepository } from '../../modules/appointments/contracts/repositories/appointments';
import { AppointmentsRepository } from '../../modules/appointments/repositories/appointments';

import { ISlotsRepository } from '../../modules/slots/contracts/repositories/slots';
import { SlotsRepository } from '../../modules/slots/repositories/slots';

import { IProgramsRepository } from '../../modules/programs/contracts/repositories/programs';
import { ProgramsRepository } from '../../modules/programs/repositories/programs';

import { IProgramSpecialtyDiscountsRepository } from '../../modules/programs/contracts/repositories/program-specialty-discounts';
import { ProgramSpecialtyDiscountsRepository } from '../../modules/programs/repositories/program-specialty-discounts';

import { IPlansRepository } from '../../modules/plans/contracts/repositories/plans';
import { PlansRepository } from '../../modules/plans/repositories/plans';

import { IPlanSpecialtyDiscountsRepository } from '../../modules/plans/contracts/repositories/plan-specialty-discounts';
import { PlanSpecialtyDiscountsRepository } from '../../modules/plans/repositories/plan-specialty-discounts';

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IProfessionalsRepository>(
  'ProfessionalsRepository',
  ProfessionalsRepository,
);

container.registerSingleton<IProfessionalSpecialtiesRepository>(
  'ProfessionalSpecialtiesRepository',
  ProfessionalSpecialtiesRepository,
);

container.registerSingleton<IPatientsRepository>(
  'PatientsRepository',
  PatientsRepository,
);

container.registerSingleton<IPatientProgramsRepository>(
  'PatientProgramsRepository',
  PatientProgramsRepository,
);

container.registerSingleton<IAnamnesesRepository>(
  'AnamnesesRepository',
  AnamnesesRepository,
);

container.registerSingleton<IPrimaryDiagnosesRepository>(
  'PrimaryDiagnosesRepository',
  PrimaryDiagnosesRepository,
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

container.registerSingleton<IProgramsRepository>(
  'ProgramsRepository',
  ProgramsRepository,
);

container.registerSingleton<IProgramSpecialtyDiscountsRepository>(
  'ProgramSpecialtyDiscountsRepository',
  ProgramSpecialtyDiscountsRepository,
);

container.registerSingleton<IPlansRepository>(
  'PlansRepository',
  PlansRepository,
);

container.registerSingleton<IPlanSpecialtyDiscountsRepository>(
  'PlanSpecialtyDiscountsRepository',
  PlanSpecialtyDiscountsRepository,
);
