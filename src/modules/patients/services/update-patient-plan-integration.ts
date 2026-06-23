import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { Patient } from '../entities/patient';
import { brevo } from '../../../shared/utils/brevo';

interface Props {
  periodEnd: number;
  priceId: string;
  patientId: string;
}

@injectable()
export class UpdatePatientPlanPartnerService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    patientId,
    priceId,
    periodEnd,
  }: Props): Promise<Patient> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      throw new AppError('Plano não encontrado, verifique e tente novamente!');
    }

    patient.planId = plan.id;
    patient.isPro = plan?.isPro ?? false;
    const dateExpiration = new Date(periodEnd);
    dateExpiration.setHours(dateExpiration.getHours() + 3);
    patient.planExpiresAt = dateExpiration;
    brevo({
      to: 'adm.hausey@gmail.com',
      subject: `💵Nova Assinatura Ativada por parceiro!`,
      body: `
      <h2>Olá, um novo paciente se cadastrou no app!</h2>
      <h4>Veja as informações:</h4>
      <p>Nome: <b>${patient.name}</b></p>
      <p>Telefone: <b>${patient.phoneNumber}</b></p>
      <p>Email: <b>${patient.email}</b><p>
      <hr/>
      <p>Valor: <b>R$${plan.price / 100}</b></p>
      <p>Expira em: <b>${patient.planExpiresAt}</b></p>
      <p>Plano: <b>${plan.name}</b></p>
    `,
    });

    const patientUpdated = await this.patientsRepository.save(patient);

    return patientUpdated;
  }
}
