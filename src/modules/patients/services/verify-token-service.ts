import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { type IPatientsRepository } from '../contracts/repositories/patients';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';

@injectable()
export class VerifyTokenService {
  constructor(
    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,

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
    const patient = await this.patientsRepository.findByEmail(email);

    if (patient === null || patient.deletedAt !== null) {
      throw new AppError(
        'Nenhum paciente encontrado, verifique e tente novamente!',
      );
    }

    if (
      patient.resetPasswordToken === null ||
      patient.resetPasswordTokenExpiresIn === null
    ) {
      throw new AppError(
        'Não há nenhum token para este paciente, gere um novo!',
      );
    }

    const now = new Date();

    if (now > patient.resetPasswordTokenExpiresIn) {
      throw new AppError('Token expirado, gere um novo!');
    }

    const tokenMatched = await this.hashProvider.compareHash(
      token,
      patient.resetPasswordToken,
    );

    if (!tokenMatched) {
      throw new AppError('Token inválido, verifique e tente novamente!');
    }
  }
}
