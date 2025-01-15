import { injectable, inject } from 'tsyringe';
import { Logger } from 'pino';
import { AppError } from 'shared/errors/app-error';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

interface Props {
  id: string;
  customerId: string;
}

@injectable()
export class UpdatePatientStriperIdService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute({ id, customerId }: Props): Promise<Patient> {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      this.logger.info({
        error: 'Paciente não encontrado.',
      });
      throw new AppError('Paciente não encontrado.');
    }

    patient.stripeCustomerId = customerId;

    const updatedPatient = await this.patientsRepository.save(patient);
    return updatedPatient;
  }
}
