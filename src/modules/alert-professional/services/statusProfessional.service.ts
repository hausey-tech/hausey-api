import { container, inject, injectable } from 'tsyringe';
import { IAppointmentsRepository } from 'modules/appointments/contracts/repositories/appointments';
import { IProfessionalsRepository } from 'modules/professionals/contracts/repositories/professionals';
import { ISlotsRepository } from 'modules/slots/contracts/repositories/slots';
import { AppError } from 'shared/errors/app-error';
import { CreateCallService } from '../../integrations/services/programmable-voice-twilio';

let count = 1;

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
    console.log('isNotRunning', isNotRunning);
    await this.professionalsRepository.findByDocument('01705661963');

    if (!isNotRunning || !isAwaiting) {
      throw new AppError('O doutor já está em um atendimento.');
    }

    if (count < 14) {
      if (isAwaiting && isNotRunning && count <= 4) {
        await callService.createCall({ to: To });
      }
      if (isAwaiting && isNotRunning && count >= 5 && count <= 10) {
        const slot = await this.slotsRepository.findByTodayDate();
        const secundary = slot.find(
          item => item.professionalType === 'secundary',
        );
        if (secundary) {
          await callService.createCall({
            to: secundary.professional.phoneNumber,
          });
        }
      }
      if (isAwaiting && isNotRunning && count >= 6 && count < 8) {
        await callService.createCall({ to: this.doctorMaster });
        count = 0;
      }
      count += 1;
    } else {
      count = 0;
    }
  }
}
