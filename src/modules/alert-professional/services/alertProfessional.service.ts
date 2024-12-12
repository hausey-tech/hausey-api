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

      console.log(principalDoctor);

      const isNotRunning =
        (await this.appointmentsRepository.findAppointmentStatusIsRunning())
          .length === 0;

      console.log('isNotRunning:', isNotRunning);

      if (isNotRunning) {
        await callService.createCall({ iAvailability: principalDoctor });
        this.logger.info(
          {
            to: principalDoctor,
          },
          'Ligação efetuada com sucesso',
        );
        return 'Ligação efetuada com sucesso';
      }
      throw new AppError('Há uma procedimento em execução.');
    } catch (error) {
      console.log('error: ', error);
      this.logger.info(
        {
          error: error.message,
        },
        'Há uma procedimento em execução.',
      );
      if (error instanceof AppError) {
        return error.message;
      }
      return 'Erro interno do servidor';
    }
  }
}
