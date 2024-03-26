import { injectable, inject } from 'tsyringe';
import crypto from 'crypto';
import { AppError } from '../../../shared/errors/app-error';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { mailer } from '../../../shared/utils/mailer';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';

@injectable()
export class ForgotPasswordService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ email }: { email: string }): Promise<void> {
    const professionalExists = await this.professionalsRepository.findByEmail(
      email,
    );

    if (professionalExists === null || professionalExists.deletedAt !== null) {
      throw new AppError(
        'Nenhum profissional encontrado, verifique e tente novamente!',
      );
    }

    const hex = crypto.randomBytes(3).toString('hex');
    const token = parseInt(hex, 16).toString().substring(0, 6);
    const hashedToken = await this.hashProvider.generateHash(token);
    const tokenExpiresIn = new Date();
    tokenExpiresIn.setHours(tokenExpiresIn.getHours() + 1);

    await this.professionalsRepository.update(professionalExists.id, {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresIn: tokenExpiresIn,
    });

    try {
      await mailer({
        to: professionalExists.email,
        subject: 'Recuperação de senha',
        body: `
          <h2>Olá, ${professionalExists.name}!</h2>
          <p>Seu token de verificação é: <b>${token}</b></p>
          <p>* O token é válido por apenas 1 hora.</p>
        `,
      });
    } catch {
      throw new AppError(
        'Erro ao enviar e-mail de recuperação. Por favor, entre em contato com nosso suporte!',
      );
    }
  }
}
