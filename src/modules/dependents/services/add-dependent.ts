import crypto from 'crypto';
import { addDays, isBefore } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { brevo } from '../../../shared/utils/brevo';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IAddDependentDTO } from '../contracts/dtos/add-dependent-dto';
import { PatientDependent } from '../entities/patient-dependent';

@injectable()
export class AddDependentService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(data: IAddDependentDTO): Promise<PatientDependent> {
    const holder = await this.patientsRepository.findById(data.holderId);

    if (!holder) {
      throw new AppError('Titular não encontrado.');
    }

    if (!holder.sellerId) {
      throw new AppError(
        'Plano familiar disponível apenas para usuários vinculados a empresas.',
      );
    }

    if (!holder.planId || !holder.planExpiresAt) {
      throw new AppError('Titular não possui assinatura ativa.');
    }

    if (!isBefore(new Date(), new Date(holder.planExpiresAt))) {
      throw new AppError('A assinatura do titular está expirada.');
    }

    const plan = await this.plansRepository.findById(holder.planId);

    if (!plan) {
      throw new AppError('Plano do titular não encontrado.');
    }

    if (plan.type !== 'family') {
      throw new AppError(
        'O plano atual não suporta dependentes. Faça upgrade para um plano familiar.',
      );
    }

    const activeDependentsCount =
      await this.dependentsRepository.countActiveByHolderId(holder.id);

    if (activeDependentsCount >= plan.maxDependents) {
      throw new AppError(
        `Limite de dependentes atingido para este plano (máximo: ${plan.maxDependents}).`,
      );
    }

    if (data.hasAppAccess === true) {
      return this.addDependentWithAppAccess(data.email, holder.id, holder);
    }

    return this.addDependentWithoutAppAccess(
      data as Extract<IAddDependentDTO, { hasAppAccess: false }>,
      holder,
    );
  }

  private async addDependentWithAppAccess(
    email: string,
    holderId: string,
    holder: Awaited<ReturnType<IPatientsRepository['findById']>>,
  ): Promise<PatientDependent> {
    const existingPatient = await this.patientsRepository.findByEmail(email);

    if (existingPatient) {
      const dependent = await this.dependentsRepository.create({
        holderId,
        dependentPatientId: existingPatient.id,
        hasAppAccess: true,
        email,
        name: existingPatient.name,
        status: 'active',
      });

      await this.patientsRepository.update(existingPatient.id, {
        planId: holder.planId,
        planExpiresAt: holder.planExpiresAt?.toISOString(),
      });

      return dependent;
    }

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiresAt = addDays(new Date(), 7);

    const dependent = await this.dependentsRepository.create({
      holderId,
      hasAppAccess: true,
      email,
      inviteToken,
      inviteExpiresAt,
      status: 'pending',
    });

    await brevo({
      to: email,
      subject: 'Você foi convidado para o plano familiar Hausey!',
      body: `
        <h2>Olá!</h2>
        <p><b>${
          holder.name
        }</b> te convidou para fazer parte do plano familiar Hausey.</p>
        <p>Crie sua conta usando este email e seu acesso será ativado automaticamente.</p>
        <p>O convite expira em 7 dias.</p>
        <p><a href="${
          process.env.APP_URL ?? 'https://app.hausey.com'
        }/cadastro?invite=${inviteToken}">Criar minha conta</a></p>
      `,
    });

    return dependent;
  }

  private async addDependentWithoutAppAccess(
    data: Extract<IAddDependentDTO, { hasAppAccess: false }>,
    holder: Awaited<ReturnType<IPatientsRepository['findById']>>,
  ): Promise<PatientDependent> {
    if (data.cpf) {
      const patientWithCpf = await this.patientsRepository.findByDocument(
        data.cpf,
      );
      if (patientWithCpf) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }
    }

    const dependentPatient = await this.patientsRepository.create({
      name: data.name,
      birthdate: data.birthdate,
      document: data.cpf,
      planId: holder.planId,
      planExpiresAt: holder.planExpiresAt,
      sellerId: holder.sellerId,
      region: holder.region,
      firstPayment: false,
    });

    const savedPatient = await this.patientsRepository.save(dependentPatient);

    const dependent = await this.dependentsRepository.create({
      holderId: holder.id,
      dependentPatientId: savedPatient.id,
      hasAppAccess: false,
      name: data.name,
      birthdate: data.birthdate,
      cpf: data.cpf,
      status: 'active',
    });

    return dependent;
  }
}
