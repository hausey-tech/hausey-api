import { injectable, inject } from 'tsyringe';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { AppError } from '../../../shared/errors/app-error';
import { Slot } from '../entities/slot';

@injectable()
export class DeleteSlotService {
  constructor(
    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute({ id }: { id: string }): Promise<Slot> {
    const slot = await this.slotsRepository.findById(id);

    if (slot === null || slot.deletedAt !== null) {
      throw new AppError(
        'Nenhum Slot encontrado, verifique e tente novamente!',
      );
    }

    const deletedSlot = await this.slotsRepository.delete(slot.id);
    return deletedSlot;
  }
}
