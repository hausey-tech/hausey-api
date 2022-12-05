import { injectable, inject, container } from 'tsyringe';

import { ICreateUserAndProfessionalDTO } from '../contracts/dtos/create-user-and-professional';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { CreateUserService } from '../../users/services/create-user';
import { Professional } from '../entities/professional';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateUserAndProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
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
    } = payload;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      name,
      cpf,
      phoneNumber,
      birthdate,
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

    await this.professionalsRepository.save(professional);

    return this.professionalsRepository.findByUserId(user.id);
  }
}
