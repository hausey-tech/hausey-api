import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCodesProperties1705954540294
  implements MigrationInterface
{
  name = 'AddSellerCodesProperties1705954540294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ALTER COLUMN "uses" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ALTER COLUMN "uses" DROP DEFAULT`,
    );
  }
}
