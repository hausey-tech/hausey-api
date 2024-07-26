import { injectable, inject } from 'tsyringe';

import { IPatientsRepository } from '../contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { ICreatePatientProfessionalAssistanceDto } from '../contracts/dtos/create-patient-professional-assistance';
import { IPatientProfessionalAssistancesRepository } from '../contracts/repositories/patient-professional-assistances';
import { PatientProfessionalAssistance } from '../entities/patient-professional-assistance';

@injectable()
export class CreatePatientProfessionalAssistanceService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientProfessionalAssistancesRepository')
    private patientProfessionalAssistanceRepository: IPatientProfessionalAssistancesRepository,
  ) {}

  public async execute(
    payload: ICreatePatientProfessionalAssistanceDto,
  ): Promise<PatientProfessionalAssistance> {
    const { assistanceType, patientId, roleId, specialtyId } = payload;
    const patientExists = await this.patientsRepository.findById(patientId);

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    const assistanceExists =
      await this.patientProfessionalAssistanceRepository.findByPatientRoleAndSpecialty(
        patientId,
        roleId,
        specialtyId,
      );
    if (!assistanceExists) {
      const patientProfesionalAssistance =
        await this.patientProfessionalAssistanceRepository.create({
          assistanceType,
          patientId,
          roleId,
          specialtyId,
        });

      return this.patientProfessionalAssistanceRepository.save(
        patientProfesionalAssistance,
      );
    }
    assistanceExists.assistanceType = assistanceType;
    return this.patientProfessionalAssistanceRepository.update(
      assistanceExists.id,
      assistanceExists,
    );
  }
}
