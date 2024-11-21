import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListSellerCodeSellersService } from '../services/list-seller-code-sellers-service';

export class SellerCodeSellersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { idSeller } = request.params;
    const listSellerCodeSellersService = container.resolve(
      ListSellerCodeSellersService,
    );

    const sellers = await listSellerCodeSellersService.execute(idSeller);

    return response.json(sellers);
  }
}
