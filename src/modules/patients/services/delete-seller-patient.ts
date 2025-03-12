import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IUpdatePatientDTO } from '../contracts/dtos/update-patient';

@injectable()
export class DeleteSellerByPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(patientId: string): Promise<any> {
    try {
      const patient = await this.patientsRepository.findById(patientId);

      if (!patient) {
        throw new AppError('Paciente com este id não encontrado');
      }

      console.log('planExpiresAt:', patient.planExpiresAt);
      const patientToUpdate: IUpdatePatientDTO = {
        birthdate: patient.birthdate ?? null,
        document: patient.document ?? null,
        fcmToken: patient.fcmToken ?? null,
        firstPayment: patient.firstPayment ?? null,
        language: patient.language ?? null,
        name: patient.name ?? null,
        password: patient.password ?? null,
        nipomed: patient.nipomed ?? null,
        phoneNumber: patient.phoneNumber ?? null,
        planExpiresAt: patient.birthdate
          ? new Date(patient.birthdate)
              .toISOString()
              .replace('T', ' ')
              .split('.')[0]
          : null,
        planId: patient.planId ?? null,
        resetPasswordToken: patient.resetPasswordToken ?? null,
        region: patient.region ?? null,
        resetPasswordTokenExpiresIn:
          patient.resetPasswordTokenExpiresIn ?? null,
        sellerId: patient.sellerId ?? null,
        sex: patient.sex ?? null,
        responsibleTeamId: patient.responsibleTeamId ?? null,
        stripeCustomerId: patient.stripeCustomerId ?? null,
      };

      await this.patientsRepository.update(patient.id, patientToUpdate);
    } catch (error) {
      this.logger.info(
        {
          error,
        },
        'Houve um erro ao deletar cupom',
      );
      throw new AppError('Erro ao deletar cupom do usuário');
    }
  }
}
