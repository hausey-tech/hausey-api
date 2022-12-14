import { injectable, inject } from 'tsyringe';

import { ISetAppointmentProfessionalDTO } from '../contracts/dtos/set-appointment-professional';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

@injectable()
export class SetAppointmentProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(
    payload: ISetAppointmentProfessionalDTO,
  ): Promise<Appointment> {
    const { appointmentId, professionalId } = payload;

    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    if (appointment.professionalId) {
      throw new AppError('Esse agendamento já possui um profissional!');
    }

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    if (
      appointment.professionalTypeId &&
      appointment.professionalTypeId !== professional.professionalTypeId
    ) {
      throw new AppError('O tipo do profissional é diferente do agendamento!');
    }

    if (
      appointment.professionalSpecialtyId !==
      professional.professionalSpecialtyId
    ) {
      throw new AppError(
        'O profissional é de uma especialidade diferente do agendamento!',
      );
    }

    appointment.professionalId = professionalId;

    return this.appointmentsRepository.save(appointment);
  }
}
