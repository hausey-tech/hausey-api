import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscountOnSellerCodes1712269224808
  implements MigrationInterface
{
  name = 'AddDiscountOnSellerCodes1712269224808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "discount" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "discount"`,
    );
  }
}
