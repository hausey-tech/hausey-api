import { container, inject, injectable } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { FindSlotsByDateService } from '../../slots/services/find-slots-by-Date';
import { CreateCallService } from '../../integrations/services/programmable-voice-twilio';
import { Professional } from '../../professionals/entities/professional';

interface IAvailability {
  id: string;
  professional: Professional;
  date: Date;
  profissionalType: string;
  slots: {
    startTime: string;
    endTime: string;
  };
}

@injectable()
export class AlertProfessionalService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(): Promise<string> {
    try {
      const callService = container.resolve(CreateCallService);
      const slotsByDate = container.resolve(FindSlotsByDateService);
      const availability = await slotsByDate.execute();
      const principalDoctor = availability.find(
        (profissional: IAvailability) =>
          profissional.profissionalType === 'principal',
      );
      const isAwaiting =
        (
          await this.appointmentsRepository.findAllAppointmentsStatusIsAwaiting()
        ).length > 0;
      const isNotRunning =
        (await this.appointmentsRepository.findAppointmentStatusIsRunning())
          .length === 0;

      const hasAppointment =
        (await this.appointmentsRepository.findAppointmentStatusIsRunning())
          .length === 0;

      if (hasAppointment && isAwaiting && isNotRunning) {
        await callService.createCall({ iAvailability: principalDoctor });
        this.logger.info({}, 'Ligação efetuada com sucesso');
        return 'Ligação efetuada com sucesso';
      }
      this.logger.info({}, 'Há uma procedimento em execução.');
      throw new AppError('Há uma procedimento em execução.');
    } catch (error) {
      if (error instanceof AppError) {
        return error.message;
      }
      this.logger.info({ error }, 'Erro interno do servidor.');
      return 'Erro interno do servidor';
    }
  }
}
