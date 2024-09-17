import { injectable, inject } from 'tsyringe';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';
import { ICreateSellerCodeSellerDTO } from '../contracts/dtos/create-seller-code-seller-dto';
import { IUsersRepository } from '../../users/contracts/repositories/users';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateSellerCodeSellerService {
  constructor(
    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    sellerCodeId,
    sellerId,
    fee,
  }: ICreateSellerCodeSellerDTO): Promise<SellerCodeSeller> {
    const seller = await this.usersRepository.findById(sellerId);
    if (!seller) {
      throw new AppError(
        'Usuário não encontrado, verifique e tente novamente!',
      );
    }

    return this.sellerCodeSellersRepository.create({
      sellerCodeId,
      sellerId,
      fee,
    });
  }
}
