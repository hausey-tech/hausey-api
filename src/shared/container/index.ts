import { container } from 'tsyringe';

import '../providers';

import { IAddressesRepository } from '../../modules/addresses/contracts/repositories/IAddressesRepository';
import { AddressesRepository } from '../../modules/addresses/repositories/AddressesRepository';

import { IProfessionalsRepository } from '../../modules/professionals/contracts/repositories/professionals';
import { ProfessionalsRepository } from '../../modules/professionals/repositories/professionals';

import { IUsersRepository } from '../../modules/users/contracts/repositories/users';
import { UsersRepository } from '../../modules/users/repositories/users';

import { IRolesRepository } from '../../modules/roles/contracts/repositories/roles';
import { RolesRepository } from '../../modules/roles/repositories/roles';

import { ISellerCodesRepository } from '../../modules/seller-codes/contracts/repositories/seller-codes';
import { SellerCodesRepository } from '../../modules/seller-codes/repositories/seller-codes';

import { ISpecialtiesRepository } from '../../modules/specialties/contracts/repositories/specialties';
import { SpecialtiesRepository } from '../../modules/specialties/repositories/specialties';

import { IProfessionalSpecialtiesRepository } from '../../modules/professionals/contracts/repositories/professional-specialties';
import { ProfessionalSpecialtiesRepository } from '../../modules/professionals/repositories/professional-specialties';

import { IPatientsRepository } from '../../modules/patients/contracts/repositories/patients';
import { PatientsRepository } from '../../modules/patients/repositories/patients';

import { IClinicalCategorysRepository } from '../../modules/clinical-categories/contracts/repositories/clinical-categories';
import { ClinicalCategorysRepository } from '../../modules/clinical-categories/repositories/clinical-categories';

import { IGroupTypesRepository } from '../../modules/group-type/contracts/repositories/group-types';
import { GroupTypesRepository } from '../../modules/group-type/repositories/group-types';

import { IPatientGroupTypesRepository } from '../../modules/patients/contracts/repositories/patient-group-types';
import { PatientGroupTypesRepository } from '../../modules/patients/repositories/patient-group-types';

import { IPatientGroupsRepository } from '../../modules/patients/contracts/repositories/patient-groups';
import { PatientGroupsRepository } from '../../modules/patients/repositories/patient-groups';

import { IPatientProfessionalAssistancesRepository } from '../../modules/patients/contracts/repositories/patient-professional-assistances';
import { PatientProfessionalAssistancesRepository } from '../../modules/patients/repositories/patient-professional-assistances';

import { IPatientProgramsRepository } from '../../modules/patients/contracts/repositories/patient-programs';
import { PatientProgramsRepository } from '../../modules/patients/repositories/patient-programs';

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

import { IPrescriptionsRepository } from '../../modules/prescriptions/contracts/repositories/IPrescriptionsRepository';
import { PrescriptionsRepository } from '../../modules/prescriptions/repositories/PrescriptionsRepository';

import { ISecretariesRepository } from '../../modules/secretaries/contracts/repositories/i-secretaries-repository';
import { SecretariesRepository } from '../../modules/secretaries/repositories/secretaries-repository';

import { IClinicalResumesRepository } from '../../modules/clinical-resumes/contracts/repositories/clinical-resumes';
import { ClinicalResumesRepository } from '../../modules/clinical-resumes/repositories/clinical-resumes';

import { IMedicalRecordsRepository } from '../../modules/medical-records/contracts/repositories/medical-records-repository';
import { MedicalRecordsRepository } from '../../modules/medical-records/repositories/medical-records-repository';

import { IMedicalRecordCidsRepository } from '../../modules/medical-records/contracts/repositories/medical-record-cids-repository';
import { MedicalRecordCidsRepository } from '../../modules/medical-records/repositories/medical-record-cids-repository';
import { IMessagesRepository } from '../../modules/messages/contracts/repositories/messages-repository';
import { MessagesRepository } from '../../modules/messages/repositories/messages-repository';

import { ITeamsRepository } from '../../modules/teams/contracts/repositories/teams-repository';
import { TeamsRepository } from '../../modules/teams/repositories/teams-repository';

import { IPatientFilesRepository } from '../../modules/patients/contracts/repositories/patient-files';
import { PatientFilesRepository } from '../../modules/patients/repositories/patient-files';

import { ITeamProfessionalsRepository } from '../../modules/teams/contracts/repositories/team-professionals-repository';
import { TeamProfessionalsRepository } from '../../modules/teams/repositories/team-professionals-repository';
import { ITeamResumesRepository } from '../../modules/team-resumes/contracts/repositories/team-resumes';
import { TeamResumesRepository } from '../../modules/team-resumes/repositories/team-resumes';
import { ReadMessagesRepository } from '../../modules/messages/repositories/read-messages-repository';
import { IReadMessagesRepository } from '../../modules/messages/contracts/repositories/read-messages-repository';

import { IErrorsRepository } from '../../modules/errors/contracts/repositories/errors-repository';
import { ErrorsRepository } from '../../modules/errors/repositories/errors-repository';

import { ISellerCodeDiscountsRepository } from '../../modules/seller-code-discounts/contracts/repositories/seller-code-discounts-repository';
import { SellerCodeDiscountsRepository } from '../../modules/seller-code-discounts/repositories/seller-code-discounts-repository';

import { ISellerCodeSellersRepository } from '../../modules/seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { SellerCodeSellersRepository } from '../../modules/seller-code-sellers/repositories/seller-code-sellers-repository';

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IProfessionalsRepository>(
  'ProfessionalsRepository',
  ProfessionalsRepository,
);

container.registerSingleton<IClinicalCategorysRepository>(
  'ClinicalCategoryRepository',
  ClinicalCategorysRepository,
);

container.registerSingleton<IClinicalResumesRepository>(
  'ClinicalResumeRepository',
  ClinicalResumesRepository,
);
container.registerSingleton<ITeamResumesRepository>(
  'TeamResumeRepository',
  TeamResumesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);
container.registerSingleton<ISellerCodesRepository>(
  'SellerCodesRepository',
  SellerCodesRepository,
);

container.registerSingleton<IProfessionalSpecialtiesRepository>(
  'ProfessionalSpecialtiesRepository',
  ProfessionalSpecialtiesRepository,
);

container.registerSingleton<IPatientsRepository>(
  'PatientsRepository',
  PatientsRepository,
);

container.registerSingleton<IPatientGroupTypesRepository>(
  'PatientsGroupTypesRepository',
  PatientGroupTypesRepository,
);

container.registerSingleton<IPatientGroupsRepository>(
  'PatientGroupsRepository',
  PatientGroupsRepository,
);
container.registerSingleton<IMessagesRepository>(
  'MessagesRepository',
  MessagesRepository,
);
container.registerSingleton<IReadMessagesRepository>(
  'ReadMessagesRepository',
  ReadMessagesRepository,
);

container.registerSingleton<IPatientProfessionalAssistancesRepository>(
  'PatientProfessionalAssistancesRepository',
  PatientProfessionalAssistancesRepository,
);

container.registerSingleton<IGroupTypesRepository>(
  'GroupTypesRepository',
  GroupTypesRepository,
);

container.registerSingleton<IPatientProgramsRepository>(
  'PatientProgramsRepository',
  PatientProgramsRepository,
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

container.registerSingleton<IPrescriptionsRepository>(
  'PrescriptionsRepository',
  PrescriptionsRepository,
);

container.registerSingleton<ISecretariesRepository>(
  'SecretariesRepository',
  SecretariesRepository,
);

container.registerSingleton<IMedicalRecordsRepository>(
  'MedicalRecordsRepository',
  MedicalRecordsRepository,
);

container.registerSingleton<IMedicalRecordCidsRepository>(
  'MedicalRecordCidsRepository',
  MedicalRecordCidsRepository,
);

container.registerSingleton<ITeamsRepository>(
  'TeamsRepository',
  TeamsRepository,
);

container.registerSingleton<ITeamProfessionalsRepository>(
  'TeamProfessionalsRepository',
  TeamProfessionalsRepository,
);

container.registerSingleton<IErrorsRepository>(
  'ErrorsRepository',
  ErrorsRepository,
);

container.registerSingleton<IPatientFilesRepository>(
  'PatientFilesRepository',
  PatientFilesRepository,
);

container.registerSingleton<ISellerCodeDiscountsRepository>(
  'SellerCodeDiscountsRepository',
  SellerCodeDiscountsRepository,
);

container.registerSingleton<ISellerCodeSellersRepository>(
  'SellerCodeSellersRepository',
  SellerCodeSellersRepository,
);
