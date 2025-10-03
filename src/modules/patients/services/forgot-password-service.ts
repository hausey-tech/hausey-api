import { injectable, inject } from 'tsyringe';
import crypto from 'crypto';
import { AppError } from '../../../shared/errors/app-error';
import { type IPatientsRepository } from '../contracts/repositories/patients';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { brevo } from '../../../shared/utils/brevo';

@injectable()
export class ForgotPasswordService {
  constructor(
    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ email }: { email: string }): Promise<void> {
    const patient = await this.patientsRepository.findByEmail(email);

    if (patient === null || patient.deletedAt !== null) {
      throw new AppError(
        'Nenhum paciente encontrado, verifique e tente novamente!',
      );
    }

    const hex = crypto.randomBytes(3).toString('hex');
    const token = parseInt(hex, 16).toString().substring(0, 6);
    const hashedToken = await this.hashProvider.generateHash(token);
    const tokenExpiresIn = new Date();
    tokenExpiresIn.setHours(tokenExpiresIn.getHours() + 1);

    await this.patientsRepository.update(patient.id, {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresIn: tokenExpiresIn,
    });

    try {
      await brevo({
        to: patient.email,
        subject: 'Recuperação de senha',
        body: `
          <h2>Olá, ${patient.name}!</h2>
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
