import { injectable, inject, container } from 'tsyringe';

import { addYears } from 'date-fns';
import { AppError } from '../../../shared/errors/app-error';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { Patient } from '../entities/patient';
import { mailer } from '../../../shared/utils/mailer';
import { WelcomePatientHtmlText } from '../../../shared/utils/html-texts';
import { UpdateSellerCodeService } from '../../seller-codes/services/update-seller-code';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';

interface Props extends Omit<ICreatePatientDTO, 'sellerId'> {
  sellerCode?: string;
}
@injectable()
export class CreatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: Props): Promise<Patient> {
    const { email, document, password, sellerCode } = payload;

    const patientExists = await this.patientsRepository.findByEmail(email);

    if (patientExists) {
      throw new AppError('Já existe um usuário com este email, faça o login!');
    }

    let sellerId: string;
    let planId: string;
    let planExpiresAt: Date;
    if (sellerCode) {
      const updateSellerCodeService = container.resolve(
        UpdateSellerCodeService,
      );
      const updatedSellerCode = await updateSellerCodeService.execute({
        code: sellerCode,
      });
      sellerId = updatedSellerCode.sellerId;
      if (updatedSellerCode.free) {
        const isTest = process.env.PAGARME_SECRET_KEY.split('_')[1] === 'test';
        const plan = await this.plansRepository.findByName(
          isTest ? 'Cuidando de você Teste' : 'Cuidando de você',
        );
        if (plan) {
          planId = plan.id;
        }
        planExpiresAt = addYears(new Date(), 2);
      }
    }

    if (document) {
      const patientWithDocumentExists =
        await this.patientsRepository.findByDocument(document);

      if (patientWithDocumentExists) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }
    }

    let hashedPassword: string;

    if (password) {
      hashedPassword = await this.hashProvider.generateHash(password);
    }

    const patientDeleted = await this.patientsRepository.findByEmailWithDeleted(
      email,
    );

    if (patientDeleted) {
      return this.patientsRepository.restore(patientDeleted.id, {
        ...payload,
        password: hashedPassword,
        sellerId,
        planId,
        planExpiresAt,
      });
    }

    const patient = await this.patientsRepository.create({
      ...payload,
      password: hashedPassword,
      sellerId,
      planId,
      planExpiresAt,
      firstPayment: true,
    });
    mailer({
      to: 'adm.hausey@gmail.com',
      subject: `📢Novo paciente cadastrado!`,
      body: `
      <h2>Olá, um novo paciente se cadastrou no app!</h2>
      <h4>Veja as informações:</h4>
      <p>Nome: <b>${patient.name}</b></p>
      <p>Email: <b>${patient.email}</b></p>
      <p>Telefone: <b>${patient.phoneNumber}</b></p>
    `,
    });
    mailer({
      to: patient.email,
      subject: `💙Boas Vindas à Hausey!`,
      body: WelcomePatientHtmlText,
    });

    return this.patientsRepository.save(patient);
  }
}
