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
    const { professionalId, professionalType, slots } = payload;

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    const professionalSlots =
      await this.slotsRepository.findByProfessionalIdAndDate(
        professionalId,
        new Date(slots[0].date),
        slots[0].times[0],
      );

    if (professionalSlots.length > 0) {
      throw new AppError(
        'Já existe um profissional de plantão neste dia e horário!',
      );
    }

    await Promise.all(
      slots.map(async slot => {
        const { date } = slot;
        slot.times.map(async time => {
          const { startTime, endTime } = time;
          await this.slotsRepository.save(
            await this.slotsRepository.create({
              professionalId,
              professionalType,
              date,
              startTime,
              endTime,
            }),
          );
        });
      }),
    );
  }
}
