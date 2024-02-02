import { injectable, inject, container } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { UpdateSellerCodeService } from '../../seller-codes/services/update-seller-code';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';

interface Props {
  name?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  planId?: string;
  sellerCode?: string;
  fcmToken?: string;
  responsibleDoctorId?: string;
}
@injectable()
export class UpdatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(id: string, payload: Props): Promise<Patient> {
    const { document, sellerCode, responsibleDoctorId, ...restOfPayload } =
      payload;

    const patientExists = await this.patientsRepository.findById(id);

    const doctorExists = await this.professionalsRepository.findById(
      responsibleDoctorId,
    );

    if (!doctorExists) {
      throw new AppError(
        'Profissional não encontrado, verifique o id e tente novamente!',
      );
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
    }
    return this.patientsRepository.update(id, {
      ...restOfPayload,
      responsibleDoctorId,
      document,
      sellerId,
    });
  }
}
