import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaxUseOnSellerCode1712433171457 implements MigrationInterface {
  name = 'AddMaxUseOnSellerCode1712433171457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" ADD "max_use" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" DROP COLUMN "max_use"`);
  }
}
