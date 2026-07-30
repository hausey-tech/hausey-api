import { isBefore } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IAcceptInviteDTO } from '../contracts/dtos/accept-invite-dto';
import { PatientDependent } from '../entities/patient-dependent';

@injectable()
export class AcceptInviteService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    inviteToken,
    patientId,
  }: IAcceptInviteDTO): Promise<PatientDependent> {
    const dependent = await this.dependentsRepository.findByInviteToken(
      inviteToken,
    );

    if (!dependent) {
      throw new AppError('Token de convite inválido.');
    }

    if (dependent.status !== 'pending') {
      throw new AppError('Este convite já foi utilizado.');
    }

    if (
      dependent.inviteExpiresAt &&
      !isBefore(new Date(), new Date(dependent.inviteExpiresAt))
    ) {
      throw new AppError(
        'Token de convite expirado. Solicite um novo convite ao titular.',
      );
    }

    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError('Paciente não encontrado.');
    }

    const { holder } = dependent;

    dependent.dependentPatientId = patientId;
    dependent.status = 'active';
    dependent.inviteToken = null;
    dependent.inviteExpiresAt = null;

    const saved = await this.dependentsRepository.save(dependent);

    await this.patientsRepository.update(patientId, {
      planId: holder.planId,
      planExpiresAt: holder.planExpiresAt?.toISOString(),
    });

    return saved;
  }
}
