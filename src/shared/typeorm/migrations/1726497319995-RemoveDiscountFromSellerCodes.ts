import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDiscountFromSellerCodes1726497319995
  implements MigrationInterface
{
  name = 'RemoveDiscountFromSellerCodes1726497319995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "discount"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "discount" integer`,
    );
  }
}
