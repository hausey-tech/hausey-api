import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { ICreateSlotDTO } from '../contracts/dtos/create-slot';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateSlotService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute(payload: ICreateSlotDTO): Promise<void> {
    const { professionalId, days } = payload;

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    await Promise.all(
      days.map(async day => {
        const { weekDay } = day;
        day.times.map(async time => {
          const { startTime, endTime } = time;
          const slot = await this.slotsRepository.create({
            professionalId,
            weekDay,
            startTime,
            endTime,
          });
          await this.slotsRepository.save(slot);
        });
      }),
    );
  }
}
