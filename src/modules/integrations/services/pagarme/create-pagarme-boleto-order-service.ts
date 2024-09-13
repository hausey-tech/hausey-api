import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { ICreatePagarmeBoletoOrderDTO } from '../../contracts/dtos/create-pagarme-boleto-order-dto';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { IUsersRepository } from '../../../users/contracts/repositories/users';

export interface IPix {
  qrCode: string;
  expiresAt: string;
}

@injectable()
export class CreatePagarmeBoletoOrderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    price,
    date,
    users,
    customer,
  }: ICreatePagarmeBoletoOrderDTO): Promise<string> {
    const split = [];
    let hauseyPart = 100;

    await Promise.all(
      users.map(async ({ id, amount }) => {
        const user = await this.usersRepository.findById(id);
        if (!user) {
          throw new AppError(
            `Usuário não encontrado, verifique e tente novamente! (userId: ${id})`,
          );
        }
        if (!user.recipientId) {
          throw new AppError(
            `Usuário não está configurado para receber pagamentos, entre em contato com o suporte! (userId: ${id})`,
          );
        }
        hauseyPart -= amount;
        split.push({
          amount,
          recipient_id: user.recipientId,
          type: 'percentage',
          options: {
            charge_processing_fee: false,
            charge_remainder_fee: false,
            liable: false,
          },
        });
      }),
    );

    if (hauseyPart < 0) {
      throw new AppError(
        'A soma das comissões dos recebedores não pode ser maior que 100%, verifique e tente novamente',
      );
    }

    try {
      const { data } = await pagarmeInstance.post('/orders', {
        customer,
        items: [
          {
            amount: price,
            description: `Boleto para ${customer.name} com vencimento em ${date}`,
            quantity: 1,
            code: `${new Date().toISOString()}:${customer.document}:${date}`,
          },
        ],
        payments: [
          {
            split: [
              ...split,
              {
                amount: hauseyPart,
                recipient_id: process.env.PAGARME_RECIPIENT_ID,
                type: 'percentage',
                options: {
                  charge_processing_fee: true,
                  charge_remainder_fee: true,
                  liable: true,
                },
              },
            ],
            payment_method: 'boleto',
            boleto: {
              due_at: date,
              instructions: `Pague para liberar acesso ao app Hausey`,
              document_number: Math.random().toString(16).substring(2),
              type: 'BDP',
            },
          },
        ],
      });
      if (data.charges[0].last_transaction?.pdf) {
        return data.charges[0].last_transaction?.pdf;
      }
      throw new AppError(
        'Erro ao criar pedido, entre em contato com o suporte!',
      );
    } catch (error) {
      console.error(error);
      throw new AppError('Erro ao criar pedido, tente novamente mais tarde!');
    }
  }
}
