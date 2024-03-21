import { injectable, inject } from 'tsyringe';

import { FindOptionsWhere } from 'typeorm';
import { ITeamResumesRepository } from '../contracts/repositories/team-resumes';
import { TeamResume } from '../entities/team-resume';

@injectable()
export class FindTeamResumes {
  constructor(
    @inject('TeamResumeRepository')
    private teamResumesRepository: ITeamResumesRepository,
  ) {}

  public async execute(query: any): Promise<TeamResume[]> {
    const { patientId, roleId } = query;

    const where: FindOptionsWhere<TeamResume> = {};

    if (patientId) {
      where.patientId = patientId;
    }
    if (roleId) {
      where.roleId = roleId;
    }
    const clinicalResumes = await this.teamResumesRepository.find(where);

    return clinicalResumes;
  }
}
