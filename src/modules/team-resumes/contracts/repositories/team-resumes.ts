import { FindOptionsWhere } from 'typeorm';
import { TeamResume } from '../../entities/team-resume';
import { ICreateTeamResumeDto } from '../dtos/create-team-resume';
import { IUpdateTeamResumeDto } from '../dtos/update-team-resume';

export interface ITeamResumesRepository {
  find(where: FindOptionsWhere<TeamResume>): Promise<TeamResume[]>;
  findByPatientId(patientId: string): Promise<TeamResume[] | null>;
  findByPatientAndRoleId(
    patientId: string,
    roleId: string,
  ): Promise<TeamResume | null>;
  findById(id: string): Promise<TeamResume | null>;
  findByProfessionalId(professionalId: string): Promise<TeamResume[] | null>;
  create(payload: ICreateTeamResumeDto): Promise<TeamResume>;
  save(patient: TeamResume): Promise<TeamResume>;
  update(id: string, payload: IUpdateTeamResumeDto): Promise<TeamResume>;
}
