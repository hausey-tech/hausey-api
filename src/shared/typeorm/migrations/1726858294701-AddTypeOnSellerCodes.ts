import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeOnSellerCodes1726858294701 implements MigrationInterface {
  name = 'AddTypeOnSellerCodes1726858294701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" DROP COLUMN "type"`);
  }
}
