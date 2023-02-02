import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class DeletePrescriptionService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointmentId,
    prescriptionId,
  }: {
    appointmentId: string;
    prescriptionId: string;
  }): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const prescription = appointment.prescriptions.find(
      value => value === prescriptionId,
    );

    if (!prescription) {
      throw new AppError(
        'Prescrição não encontrada, verifique e tente novamente!',
      );
    }

    appointment.prescriptions = appointment.prescriptions.filter(
      value => value !== prescriptionId,
    );

    return this.appointmentsRepository.save(appointment);
  }
}
