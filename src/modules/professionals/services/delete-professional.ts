import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { Professional } from '../entities/professional';

@injectable()
export class DeleteProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute({ id }: { id: string }): Promise<Professional> {
    const professional = await this.professionalsRepository.findById(id);

    if (professional === null || professional.deletedAt !== null) {
      throw new AppError(
        'Nenhum profissional encontrado, verifique e tente novamente!',
      );
    }

    const deletedProfessional = await this.professionalsRepository.delete(
      professional.id,
    );
    return deletedProfessional;
  }
}
