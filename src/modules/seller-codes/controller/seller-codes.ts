import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindAllSellerCodes } from '../services/find-all-seller-codes';
import { CreateSellerCode } from '../services/create-seller-code';
import { FindSellerCode } from '../services/find-seller-code';

export class SellerCodesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const findAllPlansService = container.resolve(FindAllSellerCodes);

    const plans = await findAllPlansService.execute(query);

    return response.json(plans);
  }

  public async findSellerCode(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const findSellerCodesService = container.resolve(FindSellerCode);
    const payload = request.body;

    const sellerCodes = await findSellerCodesService.execute(payload);

    return response.json(sellerCodes);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { code, sellerId, promotionCodeId } = request.body;

    const createPlanService = container.resolve(CreateSellerCode);

    const plan = await createPlanService.execute({
      code,
      sellerId,
      promotionCodeId,
    });

    return response.json(plan);
  }
}
