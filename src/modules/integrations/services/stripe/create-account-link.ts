import { container, inject, injectable } from 'tsyringe';
import Stripe from 'stripe';
import { CreateBankAccountService } from '../../../users/services/create-bank-account-service';
import { AppError } from '../../../../shared/errors/app-error';
import { stripeInstance } from '../../utils/stripe-instance';
import { IUsersRepository } from '../../../users/contracts/repositories/users';

interface IProps {
  userId: string;
  type: Stripe.AccountLinkCreateParams.Type;
}

@injectable()
export class CreateAccountLinkService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, type }: IProps): Promise<string> {
    try {
      const user = await this.usersRepository.findById(userId);
      let newRecipientId = '';

      if (!user) {
        throw new AppError(
          'Usuário não encontrado, verifique e tente novamente!',
        );
      }

      if (user.region === 'br') {
        throw new AppError(
          'Usuário não possui conta conectada na Stripe, verifique e tente novamente!',
        );
      }

      if (!user.recipientId) {
        const createBankAccountService = container.resolve(
          CreateBankAccountService,
        );
        await createBankAccountService.execute({
          id: user.id,
          bankAccount: undefined,
        });
        const newUser = await this.usersRepository.findById(userId);
        newRecipientId = newUser.recipientId;
      }

      const data = await stripeInstance.accountLinks.create({
        account: newRecipientId || user.recipientId,
        type,
        return_url: 'https://www.hausey.com.br/',
        refresh_url: 'https://www.hausey.com.br/',
      });
      return data.url;
    } catch (error) {
      const errorMessage = error?.message || 'Ocorreu um erro desconhecido.';
      const errorDetails = error?.response?.data || error;
      throw new AppError(
        `Erro ao criar link para conta conectada: ${errorMessage}. Detalhes: ${JSON.stringify(
          errorDetails,
        )}`,
      );
      // throw new AppError(`Erro ao criar link para conta conectada: ${error}`);
    }
  }
}
