import { injectable, inject } from 'tsyringe';

import { IProgramsRepository } from '../contracts/repositories/programs';
import { Program } from '../entities/program';

@injectable()
export class FindAllPrograms {
  constructor(
    @inject('ProgramsRepository')
    private programsRepository: IProgramsRepository,
  ) {}

  public async execute(): Promise<Program[]> {
    const programs = await this.programsRepository.findAll();

    return programs;
  }
}
