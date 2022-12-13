import { injectable, inject } from 'tsyringe';

import { IPatientAnamnesesRepository } from '../contracts/repositories/patient-anamneses';
import { ICreatePatientAnamnesisDTO } from '../contracts/dtos/create-patient-anamnesis';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { PatientAnamnesis } from '../entities/patient-anamnesis';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreatePatientAnamnesisService {
  constructor(
    @inject('PatientAnamnesesRepository')
    private patientAnamnesesRepository: IPatientAnamnesesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(
    payload: ICreatePatientAnamnesisDTO,
  ): Promise<PatientAnamnesis> {
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

    const patientAnamnesis = await this.patientAnamnesesRepository.create({
      patientId,
      appointmentId,
      description,
    });

    return this.patientAnamnesesRepository.save(patientAnamnesis);
  }
}
