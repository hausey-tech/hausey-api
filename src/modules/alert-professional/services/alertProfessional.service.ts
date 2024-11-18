import { container, inject, injectable } from 'tsyringe';
import { FindSlotsByDateService } from 'modules/slots/services/find-slots-by-Date';
import { IAppointmentsRepository } from 'modules/appointments/contracts/repositories/appointments';
import { AppError } from 'shared/errors/app-error';
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

      const hasAppointment =
        (await this.appointmentsRepository.findAppointmentStatusIsRunning())
          .length === 0;

      if (hasAppointment) {
        await callService.createCall({ iAvailability: principalDoctor });
      }

      return 'Ligação efetuada com sucesso';
    } catch (error) {
      if (error instanceof AppError) {
        return error.message;
      }
      return 'Erro interno do servidor';
    }
  }
}
