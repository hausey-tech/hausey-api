import crypto from 'crypto';
import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { brevo } from '../../../shared/utils/brevo';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { PatientDependent } from '../entities/patient-dependent';

interface Props {
  dependentId: string;
  holderId: string;
}

@injectable()
export class ResendInviteService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    dependentId,
    holderId,
  }: Props): Promise<PatientDependent> {
    const dependent = await this.dependentsRepository.findById(dependentId);

    if (!dependent) {
      throw new AppError('Dependente não encontrado.');
    }

    if (dependent.holderId !== holderId) {
      throw new AppError('Você não tem permissão para este dependente.');
    }

    if (!dependent.hasAppAccess || !dependent.email) {
      throw new AppError(
        'Reenvio de convite disponível apenas para dependentes com acesso ao app.',
      );
    }

    if (dependent.status !== 'pending') {
      throw new AppError('Este dependente já aceitou o convite.');
    }

    const holder = await this.patientsRepository.findById(holderId);

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiresAt = addDays(new Date(), 7);

    dependent.inviteToken = inviteToken;
    dependent.inviteExpiresAt = inviteExpiresAt;

    const saved = await this.dependentsRepository.save(dependent);

    await brevo({
      to: dependent.email,
      subject: 'Novo convite para o plano familiar Hausey',
      body: `
        <h2>Olá!</h2>
        <p><b>${
          holder?.name ?? 'Seu familiar'
        }</b> renovou seu convite para o plano familiar Hausey.</p>
        <p>Crie sua conta usando este email e seu acesso será ativado automaticamente.</p>
        <p><a href="${
          process.env.APP_URL ?? 'https://app.hausey.com'
        }/cadastro?invite=${inviteToken}">Criar minha conta</a></p>
      `,
    });

    return saved;
  }
}
