import { FindOptionsWhere } from 'typeorm';
import { SellerCode } from '../../entities/seller-code';
import { ICreateSellerCodeDTO } from '../dtos/create-seller-code-dto';
import { IUpdateSellerCodeDto } from '../dtos/update-seller-code-dto';

export interface ISellerCodesRepository {
  findAll(): Promise<SellerCode[]>;
  find(where: FindOptionsWhere<SellerCode>): Promise<SellerCode[]>;
  findByCode(code: string): Promise<SellerCode | null>;
  findBySellerId(sellerId: string): Promise<SellerCode | null>;
  findById(id: string): Promise<SellerCode | null>;
  create(sellerCode: ICreateSellerCodeDTO): Promise<SellerCode>;
  save(sellerCode: SellerCode): Promise<SellerCode>;
  update(id: string, payload: IUpdateSellerCodeDto): Promise<SellerCode>;
  findByIdAndType(id: string, type: string): Promise<SellerCode | null>;
  findAllPaginated(skip: number, take: number): Promise<[SellerCode[], number]>;
}
