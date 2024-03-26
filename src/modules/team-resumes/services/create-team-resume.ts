import { injectable, inject } from 'tsyringe';
import { ITeamResumesRepository } from '../contracts/repositories/team-resumes';
import { TeamResume } from '../entities/team-resume';
import { ICreateTeamResumeDto } from '../contracts/dtos/create-team-resume';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IRolesRepository } from '../../roles/contracts/repositories/roles';

@injectable()
export class CreateTeamResume {
  constructor(
    @inject('TeamResumeRepository')
    private teamResumesRepository: ITeamResumesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute({
    roleId,
    observation,
    patientId,
    professionalId,
    fileUrl,
  }: ICreateTeamResumeDto): Promise<TeamResume> {
    const patientExists = await this.patientsRepository.findById(patientId);

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    const professionalExists = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professionalExists) {
      throw new AppError(
        'Profissional não encontrado, verifique o id e tente novamente!',
      );
    }

    const roleExists = await this.rolesRepository.findById(roleId);

    if (!roleExists) {
      throw new AppError(
        'Role não encontrado, verifique o id e tente novamente!',
      );
    }
    const teamResumeExists =
      await this.teamResumesRepository.findByPatientAndRoleId(
        patientId,
        roleId,
      );
    if (teamResumeExists) {
      return this.teamResumesRepository.update(teamResumeExists.id, {
        observation,
        fileUrl,
        professionalId,
      });
    }

    // const planExists = await this.groupTypesRepository.f(name);

    // if (planExists) {
    //   throw new AppError('Já existe um plano com esse nome!');
    // }

    const resumeTeam = await this.teamResumesRepository.create({
      roleId,
      observation,
      patientId,
      professionalId,
      fileUrl,
    });

    return this.teamResumesRepository.save(resumeTeam);
  }
}
