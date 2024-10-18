import { In, Repository } from 'typeorm';
import { Patient } from '../../patients/entities/patient';
import { PostgresDataSource } from '../../../shared/typeorm';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';
import { ICreateSellerCodeSellerDTO } from '../contracts/dtos/create-seller-code-seller-dto';
import { User } from '../../users/entities/user';

export class SellerCodeSellersRepository
  implements ISellerCodeSellersRepository
{
  private ormRepository: Repository<SellerCodeSeller>;

  private ormRepositoryCode: Repository<SellerCode>;

  private ormRepositoryPatient: Repository<Patient>;

  private ormRepositoryUser: Repository<User>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(SellerCodeSeller);
    this.ormRepositoryCode = PostgresDataSource.getRepository(SellerCode);
    this.ormRepositoryPatient = PostgresDataSource.getRepository(Patient);
    this.ormRepositoryUser = PostgresDataSource.getRepository(User);
  }

  public async create(
    sellerCodeSeller: ICreateSellerCodeSellerDTO,
  ): Promise<SellerCodeSeller> {
    const seller = this.ormRepository.create(sellerCodeSeller);
    return this.ormRepository.save(seller);
  }

  public async save(
    sellerCodeSeller: SellerCodeSeller,
  ): Promise<SellerCodeSeller> {
    return this.ormRepository.save(sellerCodeSeller);
  }

  public async findAll(): Promise<SellerCodeSeller[]> {
    return this.ormRepository.find();
  }

  // Adicionando o método para buscar registros com base no id
  public async findBySellerId(sellerId: string): Promise<SellerCodeSeller[]> {
    const sellers = await this.ormRepository.find({
      where: { sellerId },
      relations: ['sellerCode'],
    });

    if (sellers.length === 0) {
      return [];
    }
    const sellerCodeIds = sellers.map(seller => seller.sellerCodeId);

    const sellerCodes = await this.ormRepositoryCode.find({
      where: { id: In(sellerCodeIds) },
      select: ['id', 'createdAt', 'sellerId', 'code', 'active', 'fee', 'type'],
    });

    const sellersWithDetails = await Promise.all(
      sellers.map(async seller => {
        const sellerCode = sellerCodes.find(
          code => code.id === seller.sellerCodeId,
        );

        if (!sellerCode) {
          return {
            ...seller,
            sellerCode: null,
            numberPatients: 0,
            sellerUser: null,
          };
        }

        const numberPatients = await this.ormRepositoryPatient.count({
          where: { sellerId: sellerCode.sellerId },
          select: [
            'id',
            'createdAt',
            'sellerId',
            'email',
            'name',
            'phoneNumber',
          ],
        });

        const sellerUser = await this.ormRepositoryUser.findOne({
          where: { id: sellerCode.sellerId },
        });

        return {
          ...seller,
          sellerCode,
          numberPatients,
          sellerUser,
        };
      }),
    );

    return sellersWithDetails;
  }
}
