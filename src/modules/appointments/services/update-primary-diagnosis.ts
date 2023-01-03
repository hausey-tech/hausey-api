import { injectable, inject } from 'tsyringe';

import { ICreatePrimaryDiagnosisDTO } from '../contracts/dtos/create-primary-diagnosis';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { IPrimaryDiagnosesRepository } from '../contracts/repositories/primary-diagnoses';
import { PrimaryDiagnosis } from '../entities/primary-diagnosis';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class UpdatePrimaryDiagnosisService {
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

    if (!appointment.primaryDiagnosisId) {
      throw new AppError(
        'Não existe um diagnóstico primário para esse agendamento, crie-o!',
      );
    }

    const primaryDiagnosis = await this.primaryDiagnosesRepository.update(
      appointment.primaryDiagnosisId,
      description,
    );

    return primaryDiagnosis;
  }
}
