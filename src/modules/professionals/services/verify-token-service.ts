import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';

@injectable()
export class VerifyTokenService {
  constructor(
    @inject('ProfessionalsRepository')
    private readonly professionalsRepository: IProfessionalsRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<void> {
    const professional = await this.professionalsRepository.findByEmail(email);

    if (professional === null || professional.deletedAt !== null) {
      throw new AppError(
        'Nenhum profissional encontrado, verifique e tente novamente!',
      );
    }

    if (
      professional.resetPasswordToken === null ||
      professional.resetPasswordTokenExpiresIn === null
    ) {
      throw new AppError(
        'Não há nenhum token para este paciente, gere um novo!',
      );
    }

    const now = new Date();

    if (now > professional.resetPasswordTokenExpiresIn) {
      throw new AppError('Token expirado, gere um novo!');
    }

    const tokenMatched = await this.hashProvider.compareHash(
      token,
      professional.resetPasswordToken,
    );

    if (!tokenMatched) {
      throw new AppError('Token inválido, verifique e tente novamente!');
    }
  }
}
