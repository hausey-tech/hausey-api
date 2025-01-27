import { FindOptionsWhere, Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';
import { SellerCode } from '../entities/seller-code';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { IUpdateSellerCodeDto } from '../contracts/dtos/update-seller-code-dto';

export class SellerCodesRepository implements ISellerCodesRepository {
  private ormRepository: Repository<SellerCode>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(SellerCode);
    this.relations = ['seller', 'discounts.plan', 'sellers.seller'];
  }

  findByType(type: string): Promise<SellerCode[] | null> {
    return this.ormRepository.find({
      where: {
        type,
      },
    });
  }

  async findAllPaginated(
    skip: number,
    limit: number,
  ): Promise<[SellerCode[], number]> {
    const [sellerCode, total] = await this.ormRepository.findAndCount({
      take: skip,
      skip: limit,
    });

    return [sellerCode, total];
  }

  public async find(
    where: FindOptionsWhere<SellerCode>,
  ): Promise<SellerCode[]> {
    return this.ormRepository.find({
      where,
      relations: this.relations,
    });
  }

  public async findAll(): Promise<SellerCode[]> {
    return this.ormRepository.find();
  }

  public async findByCode(code: string): Promise<SellerCode | null> {
    return this.ormRepository.findOne({
      where: { code },
    });
  }

  public async findById(id: string): Promise<SellerCode | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async findBySellerId(sellerId: string): Promise<SellerCode | null> {
    return this.ormRepository.findOne({
      where: { sellerId },
      relations: this.relations,
    });
  }

  public async create(sellerCode: ICreateSellerCodeDTO): Promise<SellerCode> {
    return this.ormRepository.create(sellerCode);
  }

  public async save(sellerCode: SellerCode): Promise<SellerCode> {
    return this.ormRepository.save(sellerCode);
  }

  public async update(
    id: string,
    payload: IUpdateSellerCodeDto,
  ): Promise<SellerCode> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async findByIdAndType(id: string, type: string): Promise<SellerCode> {
    return this.ormRepository.findOne({
      where: {
        id,
        type,
      },
    });
  }
}
