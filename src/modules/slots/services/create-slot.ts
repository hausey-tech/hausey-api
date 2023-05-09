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
    const { professionalId, slots } = payload;

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    await Promise.all(
      slots.map(async slot => {
        const { weekDay } = slot;
        slot.times.map(async time => {
          const { startTime, endTime } = time;
          await this.slotsRepository.save(
            await this.slotsRepository.create({
              professionalId,
              weekDay,
              startTime,
              endTime,
            }),
          );
        });
      }),
    );
  }
}
