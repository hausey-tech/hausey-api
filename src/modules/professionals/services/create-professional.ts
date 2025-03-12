import { injectable, inject, container } from 'tsyringe';

import { IRolesRepository } from '../../roles/contracts/repositories/roles';
import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { CheckIfMemedUserAlreadyExists } from '../../integrations/services/check-if-memed-user-already-exists';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { ISpecialtiesRepository } from '../../specialties/contracts/repositories/specialties';
import { ICreateProfessionalDTO } from '../contracts/dtos/create-professional';
import { UpdateMemedUser } from '../../integrations/services/update-memed-user';
import { CreateMemedUser } from '../../integrations/services/create-memed-user';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { Professional } from '../entities/professional';
import { formatDate } from '../../../shared/utils/format-date';
import { AppError } from '../../../shared/errors/app-error';
import { WelcomeProfessionalHtmlText } from '../../../shared/utils/html-texts';
import { sendgrid } from '../../../shared/utils/sendgrid';

@injectable()
export class CreateUserAndProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute({
    email,
    password,
    name,
    document,
    birthdate,
    phoneNumber,
    sex,
    specialties,
    registration,
    roleId,
    registrationUf,
    professionalTimezone,
  }: ICreateProfessionalDTO): Promise<Professional> {
    const professionalExists = await this.professionalsRepository.findByEmail(
      email,
    );

    if (professionalExists) {
      throw new AppError(
        'Já existe um professional cadastrado com esse email!',
      );
    }

    const professionalWithDocumentExists =
      await this.professionalsRepository.findByEmail(email);

    if (professionalWithDocumentExists) {
      throw new AppError(
        'Já existe um professional cadastrado com esse documento!',
      );
    }

    const role = await this.rolesRepository.findById(roleId);

    if (!role) {
      throw new AppError('RoleId Inválido, verifique e tente novamente!');
    }

    let specialtyMemedId: number;

    if (document) {
      const userWithDocumentExists =
        await this.professionalsRepository.findByDocument(document);

      if (userWithDocumentExists) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }
    }

    if (specialties) {
      await Promise.all(
        specialties.map(async specialtyId => {
          const specialty = await this.specialtiesRepository.findById(
            specialtyId,
          );

          if (!specialty) {
            throw new AppError(
              `A especialidade informada não existe, verifique e tente novamente! (id: ${specialtyId})`,
            );
          }

          specialtyMemedId = specialty.memedId;
        }),
      );
    }

    let hashedPassword: string;

    if (password) {
      hashedPassword = await this.hashProvider.generateHash(password);
    }

    const professional = await this.professionalsRepository.create({
      email,
      password: hashedPassword,
      name,
      document,
      birthdate,
      phoneNumber,
      sex,
      roleId,
      registrationUf,
      registration,
      professionalTimezone,
    });

    const savedProfessional = await this.professionalsRepository.save(
      professional,
    );
    if (specialties) {
      await Promise.all(
        specialties.map(async specialtyId => {
          await this.professionalSpecialtiesRepository.save(
            await this.professionalSpecialtiesRepository.create({
              professionalId: savedProfessional.id,
              specialtyId,
            }),
          );
        }),
      );
    }

    const checkIfMemedUserAlreadyExists = container.resolve(
      CheckIfMemedUserAlreadyExists,
    );
    if (registration) {
      const existingMemedUser = await checkIfMemedUserAlreadyExists.execute({
        cpf: savedProfessional.document,
        crm: `${savedProfessional.registration}${savedProfessional.registrationUf}`,
      });

      if (!existingMemedUser) {
        /*
          Apesar de ja ter um try/catch dentro do CreateMemedUser, boto aqui tbm pra ele
          não lançar o erro e finalizar a criação do profissional mesmo que isso ocorra!
        */
        try {
          const createMemedUserService = container.resolve(CreateMemedUser);
          const splittedName = savedProfessional.name.split(' ');
          const memedUser = await createMemedUserService.execute({
            data: {
              type: 'usuarios',
              attributes: {
                external_id: savedProfessional.id,
                nome: splittedName[0],
                sobrenome: splittedName[splittedName.length - 1],
                data_nascimento: formatDate({
                  date: savedProfessional.birthdate.toString(),
                  format: 'yyyy-MM-dd to dd/MM/yyyy',
                }),
                cpf: savedProfessional.document,
                uf: savedProfessional.registrationUf,
                crm: savedProfessional.registration,
                email,
              },
            },
            relationships: {
              especialidade: {
                data: {
                  id: specialtyMemedId,
                },
              },
            },
          });
          savedProfessional.memedStatus = memedUser?.user?.status;
        } catch (err) {
          savedProfessional.memedStatus = 'Erro ao criar usuário';
          console.error('Erro ao criar usuário na Memed', err.message);
        }
      } else {
        savedProfessional.memedStatus = existingMemedUser?.user?.status;
        try {
          const updateMemedUserService = container.resolve(UpdateMemedUser);
          await updateMemedUserService.execute({
            id: existingMemedUser.user.cpf,
            payload: {
              external_id: savedProfessional.id,
            },
          });
        } catch (err) {
          console.error(
            'Erro ao atualizar external_id do usuário na Memed',
            err.message,
          );
        }
      }
    } else {
      savedProfessional.memedStatus = 'Sem CRM';
    }
    sendgrid({
      to: savedProfessional.email,
      subject: `💙Boas Vindas à Hausey, Profissional!`,
      text: 'Aqui estão suas credenciais de acesso',
      body: WelcomeProfessionalHtmlText(savedProfessional.email, password),
    });
    // mailer({
    //   to: savedProfessional.email,
    //   subject: `💙Boas Vindas à Hausey, Profissional!`,
    //   body: WelcomeProfessionalHtmlText(savedProfessional.email, password),
    // });

    return this.professionalsRepository.save(savedProfessional);
  }
}
