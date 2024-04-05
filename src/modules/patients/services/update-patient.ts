import { injectable, inject, container } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { CreatePagarmeCustomerService } from '../../integrations/services/pagarme/create-pagarme-customer-service';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { UpdateSellerCodeService } from '../../seller-codes/services/update-seller-code';
import { ITeamsRepository } from '../../teams/contracts/repositories/teams-repository';
import { NotifySellerService } from '../../users/services/notify-seller';

interface Props {
  name?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  planId?: string;
  sellerCode?: string;
  fcmToken?: string;
  responsibleTeamId?: string;
}
@injectable()
export class UpdatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
  ) {}

  public async execute(id: string, payload: Props): Promise<Patient> {
    const { document, sellerCode, responsibleTeamId, ...restOfPayload } =
      payload;

    const patientExists = await this.patientsRepository.findById(id);

    const teamExists = await this.teamsRepository.findById(responsibleTeamId);

    if (!teamExists) {
      throw new AppError('Equipe não encontrada, verifique e tente novamente!');
    }

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    let sellerId: string;
    if (sellerCode) {
      const updateSellerCodeService = container.resolve(
        UpdateSellerCodeService,
      );
      const updatedSellerCode = await updateSellerCodeService.execute({
        code: sellerCode,
      });
      sellerId = updatedSellerCode.sellerId;
    }

    if (document) {
      const isCpfValid = cpf.isValid(document);

      if (!isCpfValid) {
        throw new AppError('CPF inválido, verifique e tente novamente!');
      }

      const patientWithDocumentExists =
        await this.patientsRepository.findByDocument(document);

      if (patientWithDocumentExists) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }

      if (!patientExists.stripeCustomerId) {
        try {
          const createPagarmeCustomerService = container.resolve(
            CreatePagarmeCustomerService,
          );
          await createPagarmeCustomerService.execute({
            id: patientExists.id,
            name: patientExists.name,
            email: patientExists.email,
            document,
            phoneNumber: patientExists.phoneNumber,
          });
        } catch (error) {
          console.error(
            `ERROR ON CREATE CUSTOMER (${patientExists.id})`,
            error,
          );
        }
      }
    }
    await this.patientsRepository.update(id, {
      ...restOfPayload,
      responsibleTeamId,
      document,
      sellerId,
    });

    const updatedUser = await this.patientsRepository.findById(id);

    if (updatedUser === null) {
      throw new AppError('Usuário atualizado, faça o login novamente!');
    }
    if (sellerId) {
      const notifySellerService = container.resolve(NotifySellerService);

      await notifySellerService.execute({
        userId: sellerId,
        patient: updatedUser,
      });
    }

    return updatedUser;
  }
}
