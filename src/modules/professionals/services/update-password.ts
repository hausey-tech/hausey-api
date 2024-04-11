import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { Professional } from '../entities/professional';
import { AppError } from '../../../shared/errors/app-error';
import { mailer } from '../../../shared/utils/mailer';
import { IUpdatePassword } from '../contracts/dtos/update-password';
import { sendgrid } from '../../../shared/utils/sendgrid';

@injectable()
export class UpdateProfessionalPasswordService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
    newPassword,
  }: IUpdatePassword): Promise<Professional> {
    const professionalExists = await this.professionalsRepository.findByEmail(
      email,
    );

    if (!professionalExists) {
      throw new AppError(
        'Já existe um professional cadastrado com esse email!',
      );
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      professionalExists.password,
    );
    if (!passwordMatched) {
      throw new AppError('Senha inválido(s)!');
    }
    const hashedPassword = await this.hashProvider.generateHash(newPassword);

    const professionalUpdated = await this.professionalsRepository.update(
      professionalExists.id,
      {
        password: hashedPassword,
      },
    );

    mailer({
      to: professionalUpdated.email,
      subject: `Sua senha foi redefinida`,
      body: `
        <h2>Olá, ${professionalUpdated.name}!</h2>
        <p>A sua senha foi redefinida com sucesso.</p>
        <p>Caso não tenha sido você, altere-a indo em "Esqueci minha senha" no app ou entre em contato com nosso suporte.</p>
      `,
    });
    sendgrid({
      to: professionalUpdated.email,
      subject: `Sua senha foi redefinida`,
      text: 'Lembrete de redefinição',
      body: `
        <h2>Olá, ${professionalUpdated.name}!</h2>
        <p>A sua senha foi redefinida com sucesso.</p>
        <p>Caso não tenha sido você, altere-a indo em "Esqueci minha senha" no app ou entre em contato com nosso suporte.</p>
      `,
    });

    return professionalUpdated;
  }
}
