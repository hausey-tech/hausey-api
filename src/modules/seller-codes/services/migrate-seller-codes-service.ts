import { injectable, inject } from 'tsyringe';

import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { ISellerCodeDiscountsRepository } from '../../seller-code-discounts/contracts/repositories/seller-code-discounts-repository';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';

@injectable()
export class MigrateSellerCodesService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('SellerCodeDiscountsRepository')
    private sellerCodeDiscountsRepository: ISellerCodeDiscountsRepository,
  ) {}

  public async execute(): Promise<void> {
    const plans = await this.plansRepository.find();
    const sellerCodes = await this.sellerCodesRepository.findAll();
    await Promise.all(
      sellerCodes.map(async sellerCode => {
        if (!sellerCode.fee && !sellerCode.free) {
          await Promise.all(
            plans.map(async plan => {
              const discount = await this.sellerCodeDiscountsRepository.create({
                sellerCodeId: sellerCode.id,
                planId: plan.id,
                discount: 1500,
              });
              await this.sellerCodeDiscountsRepository.save(discount);
            }),
          );
          await this.sellerCodesRepository.save({ ...sellerCode, fee: 50 });
        }
      }),
    );
  }
}
