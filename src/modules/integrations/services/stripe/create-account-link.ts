import { inject, injectable } from 'tsyringe';
import Stripe from 'stripe';
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

      if (!user) {
        throw new AppError(
          'Usuário não encontrado, verifique e tente novamente!',
        );
      }

      if (!user.recipientId || user.region === 'br') {
        throw new AppError(
          'Usuário não possui conta conectada na Stripe, verifique e tente novamente!',
        );
      }

      const data = await stripeInstance.accountLinks.create({
        account: user.recipientId,
        type,
      });
      return data.url;
    } catch (error) {
      throw new AppError(
        `Erro ao criar link para conta conectada: ${
          error.response.data.message as string
        }`,
      );
    }
  }
}
