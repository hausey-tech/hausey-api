import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { mailer } from '../../../shared/utils/mailer';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';

@injectable()
export class ResetPasswordService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    const professional = await this.professionalsRepository.findByEmail(email);

    if (professional === null || professional.deletedAt !== null) {
      throw new AppError(
        'Nenhum Profissional encontrado, verifique e tente novamente!',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    await this.professionalsRepository.update(professional.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiresIn: null,
    });

    mailer({
      to: professional.email,
      subject: 'Sua senha foi redefinida',
      body: `
        <h2>Olá, ${professional.name}!</h2>
        <p>A sua senha foi redefinida com sucesso.</p>
        <p>Caso não tenha sido você, altere-a indo em "Esqueci minha senha" no app ou entre em contato com nosso suporte.</p>
      `,
    });
  }
}
