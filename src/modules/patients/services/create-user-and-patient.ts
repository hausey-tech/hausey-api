import { injectable, inject, container } from 'tsyringe';

import { ICreateUserAndPatientDTO } from '../contracts/dtos/create-user-and-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { CreateUserService } from '../../users/services/create-user';
import { Patient } from '../entities/patient';

@injectable()
export class CreateUserAndPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(payload: ICreateUserAndPatientDTO): Promise<Patient> {
    const { name, email, password } = payload;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      name,
      password,
    });

    const patient = await this.patientsRepository.create({
      userId: user.id,
    });

    return this.patientsRepository.save(patient);
  }
}
