import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeeOnSellerCodes1712329357056 implements MigrationInterface {
  name = 'AddFeeOnSellerCodes1712329357056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" ADD "fee" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" DROP COLUMN "fee"`);
  }
}
