import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindTeamResumes } from '../services/find-all-team-resumes';
import { CreateTeamResume } from '../services/create-team-resume';
import { UploadTeamResumeFileService } from '../services/upload-resume-file';

export class TeamResumeController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;
    const findAllCategoriesService = container.resolve(FindTeamResumes);

    const clinicalResumes = await findAllCategoriesService.execute(query);

    return response.json(clinicalResumes);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { roleId, observation, patientId, professionalId } = request.body;

    const createClinicalCategoryService = container.resolve(CreateTeamResume);

    const plan = await createClinicalCategoryService.execute({
      roleId,
      observation,
      patientId,
      professionalId,
    });

    return response.json(plan);
  }

  public async uploadFile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { file } = request;
    const { teamId } = request.params;

    const uploadFileService = container.resolve(UploadTeamResumeFileService);

    await uploadFileService.execute({
      teamId,
      file: file as Express.Multer.File,
    });

    return response.json({ message: 'Arquivo enviado com sucesso!' });
  }
}
