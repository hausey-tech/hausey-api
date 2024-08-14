import { injectable, inject, container } from 'tsyringe';
import { ITeamResumesRepository } from '../contracts/repositories/team-resumes';
import { TeamResume } from '../entities/team-resume';
import { ICreateTeamResumeDto } from '../contracts/dtos/create-team-resume';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IRolesRepository } from '../../roles/contracts/repositories/roles';
import { CreateMessageToUserService } from '../../messages/services/create-message-to-user-service';
import { ISpecialtiesRepository } from '../../specialties/contracts/repositories/specialties';

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

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,
  ) {}

  public async execute({
    roleId,
    observation,
    patientId,
    professionalId,
    fileUrl,
    specialtyId,
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

    if (specialtyId) {
      const specialtyExists = await this.specialtiesRepository.findById(
        specialtyId,
      );

      if (!specialtyExists) {
        throw new AppError(
          'Especialidade não encontrada, verifique o id e tente novamente!',
        );
      }
    }

    const teamResumeExists =
      await this.teamResumesRepository.findByPatientAndRoleId(
        patientId,
        roleId,
        specialtyId,
      );
    const sendUserMessagePushService = container.resolve(
      CreateMessageToUserService,
    );
    try {
      await sendUserMessagePushService.execute({
        to: patientExists.id,
        title: '💙Novo Plano de Cuidados no APP!',
        body: `Você recebeu um novo plano de cuidados de ${roleExists.name}. Acesse o app para ver os detalhes!`,
        type: 'push',
      });
    } catch {
      console.log('Erro ao enviar FCM');
    }
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
      specialtyId,
    });

    return this.teamResumesRepository.save(resumeTeam);
  }
}
