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
    const slots = await this.slotsRepository.findByTodayDate();

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
      if (count < 13) {
        count += 1;
        if (isAwaiting && isNotRunning && count <= 3) {
          const doctor = slots.find(
            slot => slot.professionalType === 'principal',
          );
          await callService.createCall({ to: doctor.professional.phoneNumber });
          this.logger.info(
            {
              to: To,
              count,
            },
            'Ligação realizada para o doutor principal.',
          );
        }
        if (isAwaiting && isNotRunning && count > 3 && count <= 8) {
          const slot = await this.slotsRepository.findByTodayDate();
          const secondary = slot.find(
            item => item.professionalType === 'secondary',
          );
          if (secondary !== undefined && secondary !== null) {
            await callService.createCall({
              to: secondary.professional.phoneNumber,
            });
            this.logger.info(
              {
                to: To,
                count,
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
        if (isAwaiting && isNotRunning && count > 7 && count <= 12) {
          await callService.createCall({ to: this.doctorMaster });
          this.logger.info(
            {
              count,
              to: this.doctorMaster,
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
