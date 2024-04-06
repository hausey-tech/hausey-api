import { injectable, inject, container } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { ISetProfessionalDTO } from '../contracts/dtos/set-professional';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';
import { CreateMessageToUserService } from '../../messages/services/create-message-to-user-service';

@injectable()
export class SetProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointmentId,
    professionalId,
  }: ISetProfessionalDTO): Promise<Appointment> {
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
    const sendUserMessagePushService = container.resolve(
      CreateMessageToUserService,
    );
    try {
      await sendUserMessagePushService.execute({
        to: appointment.patientId,
        title: 'Um médico assumiu o seu plantão!',
        body: `Você já pode entrar na sala e em poucos minutos iniciará o seu atendimento.`,
        type: 'push',
      });
    } catch {
      console.log('Erro ao enviar FCM');
    }

    // const professionalSpecialties =
    //   await this.professionalSpecialtiesRepository.findByProfessionalId(
    //     professionalId,
    //   );

    // let hasRequiredSpecialty: boolean;

    // professionalSpecialties.forEach(professionalSpecialty => {
    //   if (appointment.specialtyId === professionalSpecialty.specialtyId) {
    //     hasRequiredSpecialty = true;
    //   }
    // });

    // if (!hasRequiredSpecialty) {
    //   throw new AppError(
    //     'O profissional não possui a especialidade diferente do agendamento!',
    //   );
    // }

    appointment.professionalId = professionalId;

    return this.appointmentsRepository.save(appointment);
  }
}
