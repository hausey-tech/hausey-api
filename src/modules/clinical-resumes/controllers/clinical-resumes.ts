import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindClinicalResumes } from '../services/find-all-clinical-resumes';
import { CreateClinicalResume } from '../services/create-clinical-resume';

export class ClinicalResumeController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllCategoriesService = container.resolve(FindClinicalResumes);

    const plans = await findAllCategoriesService.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      categoryId,
      clinicalResume,
      patientId,
      professionalId,
      terapeuticPlan,
    } = request.body;

    const createClinicalCategoryService =
      container.resolve(CreateClinicalResume);

    const plan = await createClinicalCategoryService.execute({
      categoryId,
      clinicalResume,
      patientId,
      professionalId,
      terapeuticPlan,
    });

    return response.json(plan);
  }
}
