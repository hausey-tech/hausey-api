import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class ToggleFinishedService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointmentId,
  }: {
    appointmentId: string;
  }): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    appointment.finished = !appointment.finished;

    return this.appointmentsRepository.save(appointment);
  }
}
