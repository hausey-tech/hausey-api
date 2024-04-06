import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { SellerCode } from '../entities/seller-code';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';

interface Props {
  code: string;
}
@injectable()
export class UpdateSellerCodeService {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute({ code }: Props): Promise<SellerCode> {
    const sellerCodeExists = await this.sellerCodesRepository.findByCode(code);

    if (!sellerCodeExists) {
      throw new AppError(
        'Código não encontrado, verifique o id e tente novamente!',
      );
    }

    if (
      sellerCodeExists.maxUse &&
      sellerCodeExists.maxUse <= sellerCodeExists.uses
    ) {
      throw new AppError('Código esgotado, verifique e tente novamente!');
    }

    const uses = sellerCodeExists.uses + 1;

    return this.sellerCodesRepository.update(sellerCodeExists.id, { uses });
  }
}
