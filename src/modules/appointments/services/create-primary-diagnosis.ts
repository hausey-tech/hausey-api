import { injectable, inject } from 'tsyringe';

import { IPrimaryDiagnosesRepository } from '../contracts/repositories/primary-diagnoses';
import { ICreatePrimaryDiagnosisDTO } from '../contracts/dtos/create-primary-diagnosis';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { PrimaryDiagnosis } from '../entities/primary-diagnosis';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreatePrimaryDiagnosisService {
  constructor(
    @inject('PrimaryDiagnosesRepository')
    private primaryDiagnosesRepository: IPrimaryDiagnosesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(
    payload: ICreatePrimaryDiagnosisDTO,
  ): Promise<PrimaryDiagnosis> {
    const { appointmentId, description } = payload;

    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    if (appointment.primaryDiagnosisId) {
      throw new AppError(
        'Já existe um diagnóstico primário para esse agendamento, edite-o!',
      );
    }

    const primaryDiagnosis = await this.primaryDiagnosesRepository.save(
      await this.primaryDiagnosesRepository.create({
        appointmentId,
        description,
      }),
    );

    appointment.primaryDiagnosisId = primaryDiagnosis.id;

    this.appointmentsRepository.save(appointment);

    return primaryDiagnosis;
  }
}
