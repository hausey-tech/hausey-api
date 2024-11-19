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

    try {
      if (count < 14) {
        count += 1;
        this.logger.info(
          {
            count,
            isAwaiting,
            isNotRunning,
            firsIf: isAwaiting && isNotRunning && count <= 2,
            secondIf: isAwaiting && isNotRunning && count > 2 && count <= 4,
            thirdIf: isAwaiting && isNotRunning && count > 4,
          },
          'Procedimento iniciado',
        );
        if (isAwaiting && isNotRunning && count <= 2) {
          await callService.createCall({ to: To });
          this.logger.info(
            {
              to: To,
            },
            'Ligação realizada para o doutor principal.',
          );
        }
        if (isAwaiting && isNotRunning && count > 2 && count <= 4) {
          const slot = await this.slotsRepository.findByTodayDate();
          const secondary = slot.find(
            item => item.professionalType === 'secondary',
          );
          this.logger.info(
            {
              secondary: secondary.professionalType,
              validate: secondary !== undefined && secondary !== null,
              ligarPara: secondary.professional.phoneNumber,
            },
            'Entrei no if',
          );
          if (secondary !== undefined && secondary !== null) {
            this.logger.info(
              {
                secondary,
              },
              'Console do secondary dentro do if',
            );
            await callService.createCall({
              to: secondary.professional.phoneNumber,
            });
            this.logger.info(
              {
                to: To,
              },
              'Ligação realizada para o doutor secundário.',
            );
          } else {
            this.logger.info(
              {},
              'Não foi possível achar um doutor secundário.',
            );
          }
        }
        if (isAwaiting && isNotRunning && count > 4) {
          await callService.createCall({ to: this.doctorMaster });
          count = 0;
          this.logger.info(
            {
              count,
              isAwaiting,
              isNotRunning,
            },
            'Ligando para o Doutor Master',
          );
        }
      } else {
        this.logger.info({}, 'Contagem zerada.');
        count = 0;
      }
    } catch (error) {
      this.logger.info(
        {
          error: error.message,
        },
        'Houve um erro ao efetuar a ligação',
      );
    }
  }
}
