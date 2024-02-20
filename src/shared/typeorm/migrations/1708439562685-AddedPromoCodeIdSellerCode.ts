import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPromoCodeIdSellerCode1708439562685
  implements MigrationInterface
{
  name = 'AddedPromoCodeIdSellerCode1708439562685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "promotion_code_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "promotion_code_id"`,
    );
  }
}
