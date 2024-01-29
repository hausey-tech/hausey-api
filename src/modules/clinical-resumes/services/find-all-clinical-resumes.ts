import { injectable, inject } from 'tsyringe';

import { FindOptionsWhere } from 'typeorm';
import { IClinicalResumesRepository } from '../contracts/repositories/clinical-resumes';
import { ClinicalResume } from '../entities/clinical-resume';

@injectable()
export class FindClinicalResumes {
  constructor(
    @inject('ClinicalResumeRepository')
    private clinicalResumesRepository: IClinicalResumesRepository,
  ) {}

  public async execute(query: any): Promise<ClinicalResume[]> {
    const { patientId } = query;

    const where: FindOptionsWhere<ClinicalResume> = {};

    if (patientId) {
      where.patientId = patientId;
    }
    const clinicalResumes = await this.clinicalResumesRepository.find(where);

    return clinicalResumes;
  }
}
