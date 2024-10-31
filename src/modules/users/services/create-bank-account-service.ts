import { injectable, inject, container } from 'tsyringe';
import { CreatePagarmeRecipientService } from '../../integrations/services/pagarme/create-pagarme-recipient-service';
import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { ICreateBankAccount } from '../contracts/dtos/create-bank-account-dto';
import { CreateConnectAccountService } from '../../integrations/services/stripe/create-connected-account';

@injectable()
export class CreateBankAccountService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, bankAccount }: ICreateBankAccount): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError(
        'Usuário não encontrado, verifique e tente novamente!',
      );
    }

    try {
      let recipientId: string;
      if (user.region && user.region !== 'br') {
        const createConnectedAccountService = container.resolve(
          CreateConnectAccountService,
        );
        recipientId = await createConnectedAccountService.execute({
          id,
          email: user.email,
          bankAccount,
        });
      } else {
        const createPagarmeRecipientService = container.resolve(
          CreatePagarmeRecipientService,
        );

        recipientId = await createPagarmeRecipientService.execute({
          id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          bankAccount,
        });
      }

      await this.usersRepository.update(id, { recipientId });
    } catch (error) {
      throw new AppError(
        'Erro ao criar conta bancária, entre em contato com o suporte!',
      );
    }
  }
}
