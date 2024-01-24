import { injectable, inject } from 'tsyringe';

import { IClinicalResumesRepository } from '../contracts/repositories/clinical-resumes';
import { ClinicalResume } from '../entities/clinical-resume';

@injectable()
export class FindClinicalResumes {
  constructor(
    @inject('ClinicalResumeRepository')
    private clinicalResumesRepository: IClinicalResumesRepository,
  ) {}

  public async execute(): Promise<ClinicalResume[]> {
    const roles = await this.clinicalResumesRepository.findAll();

    return roles;
  }
}
