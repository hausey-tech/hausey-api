import Professional from '../entities/Professional';

export default interface IProfessionalsRepository {
  findByUserId(id: string): Promise<Professional | null>;
}
