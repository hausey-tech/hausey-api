import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindClinicalCategories } from '../services/find-all-clinical-category';
import { CreateClinicalCategory } from '../services/create-clinical-category';

export class ClinicalCategoryController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllCategoriesService = container.resolve(FindClinicalCategories);

    const plans = await findAllCategoriesService.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, roleId } = request.body;

    const createClinicalCategoryService = container.resolve(
      CreateClinicalCategory,
    );

    const plan = await createClinicalCategoryService.execute({
      name,
      description,
      roleId,
    });

    return response.json(plan);
  }
}
