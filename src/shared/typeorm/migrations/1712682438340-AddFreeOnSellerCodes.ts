import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFreeOnSellerCodes1712682438340 implements MigrationInterface {
  name = 'AddFreeOnSellerCodes1712682438340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "free" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seller_codes" DROP COLUMN "free"`);
  }
}
