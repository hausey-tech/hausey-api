import { injectable, inject, container } from 'tsyringe';

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

@injectable()
export class CreateUserAndProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(payload: ICreateProfessionalDTO): Promise<Professional> {
    const {
      email,
      password,
      name,
      document,
      birthdate,
      phoneNumber,
      sex,
      specialties,
      registration,
      registrationUf,
    } = payload;

    let specialtyMemedId: number;

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
      registrationUf,
      registration,
    });

    const savedProfessional = await this.professionalsRepository.save(
      professional,
    );

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

    const checkIfMemedUserAlreadyExists = container.resolve(
      CheckIfMemedUserAlreadyExists,
    );

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

    return this.professionalsRepository.save(savedProfessional);
  }
}
