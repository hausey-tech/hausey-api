import { Response } from 'express';
import { container } from 'tsyringe';
import { ListSellerCodeSellersService } from '../services/list-seller-code-sellers-service';

export class SellerCodeSellersController {
  public async index(res: Response): Promise<Response> {
    const listSellerCodeSellersService = container.resolve(
      ListSellerCodeSellersService,
    );

    const sellers = await listSellerCodeSellersService.execute();
    console.log('sellers');

    return res.json(sellers);
  }
}
