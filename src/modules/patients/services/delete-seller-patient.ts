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

      const patientToUpdate: IUpdatePatientDTO = {
        birthdate: patient.birthdate,
        document: patient.document,
        fcmToken: patient.fcmToken,
        firstPayment: patient.firstPayment,
        language: patient.language,
        name: patient.name,
        password: patient.password,
        nipomed: patient.nipomed,
        phoneNumber: patient.phoneNumber,
        planExpiresAt: patient.planExpiresAt.toString(),
        planId: patient.planId,
        resetPasswordToken: patient.resetPasswordToken,
        region: patient.region,
        resetPasswordTokenExpiresIn: patient.resetPasswordTokenExpiresIn,
        sellerId: patient.sellerId,
        sex: patient.sex,
        responsibleTeamId: patient.responsibleTeamId,
        stripeCustomerId: patient.stripeCustomerId,
      };

      await this.patientsRepository.update(patient.id, patientToUpdate);
    } catch (error) {
      throw new AppError('Erro ao deletar cupom de usuário');
    }
  }
}
