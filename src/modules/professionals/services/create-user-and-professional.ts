import { injectable, inject, container } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ICreateUserAndProfessionalDTO } from '../contracts/dtos/create-user-and-professional';
import { IProfessionalTypesRepository } from '../contracts/repositories/professional-types';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { CreateUserService } from '../../users/services/create-user';
import { CreateMemedUser } from '../../integrations/services/create-memed-user';
import { Professional } from '../entities/professional';
import { formatDate } from '../../../shared/utils/format-date';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateUserAndProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('ProfessionalTypesRepository')
    private professionalTypesRepository: IProfessionalTypesRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(
    payload: ICreateUserAndProfessionalDTO,
  ): Promise<Professional> {
    const {
      name,
      email,
      cpf,
      professionalTypeId,
      professionalSpecialtyId,
      registrationUf,
      registration,
      phoneNumber,
      birthdate,
      specialtyRegistration,
      password,
    } = payload;

    const professionalType = await this.professionalTypesRepository.findById(
      professionalTypeId,
    );

    if (!professionalType) {
      throw new AppError(
        'O tipo de profissional informado não existe, verifique e tente novamente!',
      );
    }

    const professionalSpecialty = professionalSpecialtyId
      ? await this.professionalSpecialtiesRepository.findById(
          professionalSpecialtyId,
        )
      : null;

    if (professionalSpecialtyId && !professionalSpecialty) {
      throw new AppError(
        'A especialidade informada não existe, verifique e tente novamente!',
      );
    }

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      name,
      cpf,
      phoneNumber,
      birthdate,
      password,
    });

    const checkProfessionalExists =
      await this.professionalsRepository.findByUserId(user.id);

    if (checkProfessionalExists) {
      throw new AppError(
        'Já existe um profissional vinculado a este usuário, faça o login!',
      );
    }

    const professional = await this.professionalsRepository.create({
      userId: user.id,
      professionalTypeId,
      professionalSpecialtyId,
      registrationUf,
      registration,
      specialtyRegistration,
    });

    const savedProfessional = await this.professionalsRepository.save(
      professional,
    );

    if (professionalSpecialtyId) {
      try {
        const createMemedUserService = container.resolve(CreateMemedUser);
        const splittedName = user.name.split(' ');
        const memedUser = await createMemedUserService.execute({
          data: {
            type: 'usuarios',
            attributes: {
              external_id: savedProfessional.id,
              nome: splittedName[0],
              sobrenome: splittedName[splittedName.length - 1],
              data_nascimento: formatDate(user.birthdate.toString()),
              cpf: user.cpf,
              uf: savedProfessional.registrationUf,
              crm: savedProfessional.registration,
              email: user.email,
            },
          },
          relationships: {
            especialidade: {
              data: {
                id: professionalSpecialty.memedId,
              },
            },
          },
        });
        savedProfessional.memedStatus = memedUser?.user?.status;
      } catch (err) {
        savedProfessional.memedStatus = 'Erro ao criar usuário';
        console.error(
          'Erro ao criar usuário na Memed',
          err?.response?.data?.errors[0].detail,
        );
      }
    }

    await this.professionalsRepository.save(savedProfessional);

    return this.professionalsRepository.findByUserId(user.id);
  }
}
