import { injectable, inject, container } from 'tsyringe';

import { cpf } from 'cpf-cnpj-validator';
import { IRolesRepository } from '../../roles/contracts/repositories/roles';
import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { CheckIfMemedUserAlreadyExists } from '../../integrations/services/check-if-memed-user-already-exists';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { ISpecialtiesRepository } from '../../specialties/contracts/repositories/specialties';
import { UpdateMemedUser } from '../../integrations/services/update-memed-user';
import { CreateMemedUser } from '../../integrations/services/create-memed-user';
import { Professional } from '../entities/professional';
import { formatDate } from '../../../shared/utils/format-date';
import { AppError } from '../../../shared/errors/app-error';
import { IUpdateProfessionalDTO } from '../contracts/dtos/update-professional';

@injectable()
export class UpdateProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(
    id: string,
    payload: IUpdateProfessionalDTO,
  ): Promise<Professional> {
    const { document, roleId, specialties, registration, ...restOfPayload } =
      payload;
    const professionalExists = await this.professionalsRepository.findById(id);

    if (!professionalExists) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    const role = await this.rolesRepository.findById(roleId);

    if (!role) {
      throw new AppError('RoleId Inválido, verifique e tente novamente!');
    }

    let specialtyMemedId: number;

    if (document) {
      const isCpfValid = cpf.isValid(document);

      if (!isCpfValid) {
        throw new AppError('CPF inválido, verifique e tente novamente!');
      }
      if (document !== professionalExists.document) {
        const userWithDocumentExists =
          await this.professionalsRepository.findByDocument(document);

        if (userWithDocumentExists) {
          throw new AppError(
            'Já existe um usuário com este CPF, verifique e tente novamente!',
          );
        }
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

    const professional = await this.professionalsRepository.update(id, {
      ...restOfPayload,
      document,
      specialties,
      roleId,
      registration,
    });

    if (specialties) {
      await Promise.all(
        specialties.map(async specialtyId => {
          await this.professionalSpecialtiesRepository.save(
            await this.professionalSpecialtiesRepository.create({
              professionalId: professional.id,
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
        cpf: professional.document,
        crm: `${professional.registration}${professional.registrationUf}`,
      });

      if (!existingMemedUser) {
        /*
          Apesar de ja ter um try/catch dentro do CreateMemedUser, boto aqui tbm pra ele
          não lançar o erro e finalizar a criação do profissional mesmo que isso ocorra!
        */
        try {
          const createMemedUserService = container.resolve(CreateMemedUser);
          const splittedName = professional.name.split(' ');
          const memedUser = await createMemedUserService.execute({
            data: {
              type: 'usuarios',
              attributes: {
                external_id: professional.id,
                nome: splittedName[0],
                sobrenome: splittedName[splittedName.length - 1],
                data_nascimento: formatDate({
                  date: professional.birthdate.toString(),
                  format: 'yyyy-MM-dd to dd/MM/yyyy',
                }),
                cpf: professional.document,
                uf: professional.registrationUf,
                crm: professional.registration,
                email: professional.email,
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
          professional.memedStatus = memedUser?.user?.status;
        } catch (err) {
          professional.memedStatus = 'Erro ao criar usuário';
          console.error('Erro ao criar usuário na Memed', err.message);
        }
      } else {
        professional.memedStatus = existingMemedUser?.user?.status;
        try {
          const updateMemedUserService = container.resolve(UpdateMemedUser);
          await updateMemedUserService.execute({
            id: existingMemedUser.user.cpf,
            payload: {
              external_id: professional.id,
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
      professional.memedStatus = 'Sem CRM';
    }

    return this.professionalsRepository.save(professional);
  }
}
