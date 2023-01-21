import { injectable, inject, container } from 'tsyringe';

import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import { ICreateProfessionalDTO } from '../contracts/dtos/create-professional';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { CreateMemedUser } from '../../integrations/services/create-memed-user';
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
      specialtyId,
      specialtyRegistration,
      registration,
      registrationUf,
    } = payload;

    const specialty = await this.specialtiesRepository.findById(specialtyId);

    if (!specialty) {
      throw new AppError(
        'A especialidade informada não existe, verifique e tente novamente!',
      );
    }

    const professional = await this.professionalsRepository.create({
      email,
      password,
      name,
      document,
      birthdate,
      phoneNumber,
      sex,
      specialtyId,
      specialtyRegistration,
      registrationUf,
      registration,
    });

    const savedProfessional = await this.professionalsRepository.save(
      professional,
    );

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
              id: specialty.memedId,
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

    return this.professionalsRepository.save(savedProfessional);
  }
}
