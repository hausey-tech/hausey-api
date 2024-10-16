import { Equal, In, Repository } from 'typeorm';
import { Patient } from '../../patients/entities/patient';
import { PostgresDataSource } from '../../../shared/typeorm';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';
import { ICreateSellerCodeSellerDTO } from '../contracts/dtos/create-seller-code-seller-dto';

export class SellerCodeSellersRepository
  implements ISellerCodeSellersRepository
{
  private ormRepository: Repository<SellerCodeSeller>;

  private ormRepositoryCode: Repository<SellerCode>;

  private ormRepositoryPatient: Repository<Patient>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(SellerCodeSeller);
    this.ormRepositoryCode = PostgresDataSource.getRepository(SellerCode);
    this.ormRepositoryPatient = PostgresDataSource.getRepository(Patient);
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
    console.log('SellerCodeSellersRepository.findBySellerId()...', sellerId);

    // Buscar na tabela seller_code onde seller_id é igual ao sellerId fornecido
    const sellerCodes = await this.ormRepositoryCode.find({
      where: { sellerId: Equal(sellerId) }, // Usando Equal para verificar pelo sellerId fornecido
    });

    // Se não encontrar nenhum sellerCode, retornar uma lista vazia
    if (sellerCodes.length === 0) {
      return [];
    }

    // Extraindo os IDs de seller_code encontrados
    const sellerCodeIds = sellerCodes.map(sellerCode => sellerCode.id);

    // Buscar na tabela seller_code_sellers onde seller_code_id está nos IDs encontrados
    const sellers = await this.ormRepository.find({
      where: { sellerCodeId: In(sellerCodeIds) }, // Verificando pelo seller_code_id
      relations: ['sellerCode', 'seller'], // Incluindo as relações apropriadas
    });

    // Adicionando o campo qtdPacients baseado no sellerId
    const sellersWithPatientsCount = await Promise.all(
      sellers.map(async sellerCodeSeller => {
        // Contar pacientes que possuem o mesmo sellerId
        const patientCount = await this.ormRepositoryPatient.count({
          where: { sellerId: sellerCodeSeller.sellerId }, // Contar pacientes com sellerId igual
        });

        // Retornar o objeto com o campo adicional qtdPacients
        return {
          ...sellerCodeSeller,
          qtdPacients: patientCount, // Adicionando o campo qtdPacients
        };
      }),
    );

    return sellersWithPatientsCount;
  }
}
