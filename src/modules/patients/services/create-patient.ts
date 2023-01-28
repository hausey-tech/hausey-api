import { injectable, inject } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../shared/errors/app-error';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { Patient } from '../entities/patient';

@injectable()
export class CreatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: ICreatePatientDTO): Promise<Patient> {
    const { email, document, password } = payload;

    const patientExists = await this.patientsRepository.findByEmail(email);

    if (patientExists) {
      throw new AppError('Já existe um usuário com este email, faça o login!');
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

    const hashedPassword = password
      ? await this.hashProvider.generateHash(password)
      : undefined;

    const patientDeleted = await this.patientsRepository.findByEmailWithDeleted(
      email,
    );

    if (patientDeleted) {
      return this.patientsRepository.restore(patientDeleted.id, {
        ...payload,
        password: hashedPassword,
      });
    }

    const patient = await this.patientsRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return this.patientsRepository.save(patient);
  }
}
