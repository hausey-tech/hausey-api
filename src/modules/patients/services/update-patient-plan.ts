import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { brevo } from '../../../shared/utils/brevo';

interface Props {
  periodEnd: number;
  priceId: string;
  customerId: string;
}

@injectable()
export class UpdatePatientPlanService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    customerId,
    priceId,
    periodEnd,
  }: Props): Promise<Patient> {
    const patient = await this.patientsRepository.findByCustomerId(customerId);

    if (!patient) {
      console.error('Paciente não encontrado!');
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      console.error('Plano não encontrado!');
    }

    patient.planId = plan.id;
    patient.isPro = plan?.isPro ?? false;
    patient.planExpiresAt = new Date(periodEnd * 1000);
    brevo({
      to: 'adm.hausey@gmail.com',
      subject: `💵Nova Compra de Assinatura Efetuada!`,
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

    const updatedPatient = await this.patientsRepository.save(patient);
    return updatedPatient;
  }
}
