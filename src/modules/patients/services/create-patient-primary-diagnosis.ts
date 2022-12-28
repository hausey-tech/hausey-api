import { injectable, inject } from 'tsyringe';

import { IPatientPrimaryDiagnosesRepository } from '../contracts/repositories/patient-primary-diagnoses';
import { ICreatePatientPrimaryDiagnosisDTO } from '../contracts/dtos/create-patient-primary-diagnosis';
import { PatientPrimaryDiagnosis } from '../entities/patient-primary-diagnosis';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreatePatientPrimaryDiagnosisService {
  constructor(
    @inject('PatientPrimaryDiagnosesRepository')
    private patientPrimaryDiagnosesRepository: IPatientPrimaryDiagnosesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(
    payload: ICreatePatientPrimaryDiagnosisDTO,
  ): Promise<PatientPrimaryDiagnosis> {
    const { patientId, appointmentId, description } = payload;

    const checkPatientExists = await this.patientsRepository.findById(
      patientId,
    );

    if (!checkPatientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const checkAppointmentExists = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!checkAppointmentExists) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const patientPrimaryDiagnosis =
      await this.patientPrimaryDiagnosesRepository.create({
        patientId,
        appointmentId,
        description,
      });

    return this.patientPrimaryDiagnosesRepository.save(patientPrimaryDiagnosis);
  }
}
