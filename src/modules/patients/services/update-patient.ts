import { injectable, inject } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IUpdatePatientDTO } from '../contracts/dtos/update-patient';
import { Patient } from '../entities/patient';

@injectable()
export class UpdatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(
    id: string,
    payload: IUpdatePatientDTO,
  ): Promise<Patient> {
    const { document } = payload;

    const patientExists = await this.patientsRepository.findById(id);

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
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

    return this.patientsRepository.update(id, payload);
  }
}
