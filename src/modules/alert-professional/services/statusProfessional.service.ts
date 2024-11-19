import { container, inject, injectable } from 'tsyringe';
import { Logger } from 'pino';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { AppError } from '../../../shared/errors/app-error';
import { CreateCallService } from '../../integrations/services/programmable-voice-twilio';
import { ISlotsRepository } from '../../slots/contracts/repositories/slots';

let count = 0;

@injectable()
export class TryCallProfessionalService {
  private readonly doctorMaster: string;

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
    @inject('Logger')
    private logger: Logger,
  ) {
    this.doctorMaster = process.env.DOCTOR_MASTER;
  }

  public async execute(To: string): Promise<any> {
    const callService = container.resolve(CreateCallService);
    const isAwaiting =
      (await this.appointmentsRepository.findAllAppointmentsStatusIsAwaiting())
        .length > 0;
    const isNotRunning =
      (await this.appointmentsRepository.findAppointmentStatusIsRunning())
        .length === 0;
    await this.professionalsRepository.findByDocument('01705661963');

    this.logger.info(
      {
        count,
        isAwaiting,
        isNotRunning,
      },
      'Procedimento iniciado',
    );

    if (!isNotRunning || !isAwaiting) {
      this.logger.info(
        {
          isNotRunning: !isNotRunning,
          isAwaiting: !isAwaiting,
        },
        'O doutor já está em um atendimento',
      );
      throw new AppError('O doutor já está em um atendimento.');
    }

    if (count < 14) {
      count += 1;
      if (isAwaiting && isNotRunning && count <= 4) {
        await callService.createCall({ to: To });
        this.logger.info(
          {
            to: To,
          },
          'Ligação realizada para o número acima.',
        );
      }
      if (isAwaiting && isNotRunning && count >= 5 && count <= 10) {
        const slot = await this.slotsRepository.findByTodayDate();
        const secundary = slot.find(
          item => item.professionalType === 'secondary',
        );
        if (secundary) {
          await callService.createCall({
            to: secundary.professional.phoneNumber,
          });
          this.logger.info(
            {
              to: To,
            },
            'Ligação realizada para o número acima.',
          );
        }
      }
      if (isAwaiting && isNotRunning && count >= 11 && count < 14) {
        await callService.createCall({ to: this.doctorMaster });
        count = 0;
        this.logger.info(
          {
            to: To,
          },
          'Ligação realizada para o número acima.',
        );
      }
    } else {
      this.logger.info({}, 'Contagem zerada.');
      count = 0;
    }
  }
}
