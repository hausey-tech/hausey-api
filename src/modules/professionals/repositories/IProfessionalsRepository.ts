import Professional from '../infra/typeorm/entities/Professional';

export default interface IProfessionalsRepository {
  findByUserId(id: string): Promise<Professional | null>;
}
