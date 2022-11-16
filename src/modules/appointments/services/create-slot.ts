import { injectable, inject } from 'tsyringe';

import { ISlotsRepository, ICreateSlotDTO } from '../contracts';
import { IProfessionalsRepository } from '../../professionals/contracts';
import { AppError } from '../../../shared/errors';
import { Slot } from '../entities';

@injectable()
export class CreateSlotService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute(payload: ICreateSlotDTO): Promise<Slot> {
    const { professionalId, weekDay, startTime, endTime } = payload;

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    const slot = await this.slotsRepository.create({
      professionalId,
      weekDay,
      startTime,
      endTime,
    });

    await this.slotsRepository.save(slot);

    return slot;
  }
}
