import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { type IPatientsRepository } from '../contracts/repositories/patients';
import { type IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { brevo } from '../../../shared/utils/brevo';

@injectable()
export class ResetPasswordService {
  constructor(
    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,

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
    const patient = await this.patientsRepository.findByEmail(email);

    if (patient === null || patient.deletedAt !== null) {
      throw new AppError(
        'Nenhum paciente encontrado, verifique e tente novamente!',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    await this.patientsRepository.update(patient.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiresIn: null,
    });

    brevo({
      to: patient.email,
      subject: 'Sua senha foi redefinida',
      body: `
        <h2>Olá, ${patient.name}!</h2>
        <p>A sua senha foi redefinida com sucesso.</p>
        <p>Caso não tenha sido você, altere-a indo em "Esqueci minha senha" no app ou entre em contato com nosso suporte.</p>
      `,
    });
  }
}
