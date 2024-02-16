import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { Patient } from '../../patients/entities/patient';
import { mailer } from '../../../shared/utils/mailer';

interface Props {
  userId: string;
  patient: Patient;
}
@injectable()
export class NotifySellerService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, patient }: Props): Promise<string> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(
        'Vendedor não encontrado, verifique o id e tente novamente!',
      );
    }
    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    mailer({
      to: user.email,
      subject: `🎉Parabéns! O usuário ${patient.name} Efetuou o Cadastro com seu Código!`,
      body: `
      <h2>Olá, ${user.name}!</h2>
      <h4>Parabéns! Mais um usuário cadastrou-se utilizando o seu código:</h4>
      <p><b>Verifique as informações</b></p>
      <p>Nome: <b>${patient.name}</b></p>
      <p>Email: <b>${patient.email}</b></p>
      <p>Telefone: <b>${patient.phoneNumber}</b></p>
      <hr/>
      <p>Clique no link abaixo para ver detalhes no portal:</p>
      <a href=${'https://hausey.com.br/comercial/dashboard'} target="_blank">Acessar portal<a/>

    `,
    });

    return 'Mensagem Enviada!';
  }
}
