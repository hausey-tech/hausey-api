import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerToUser1705597259568 implements MigrationInterface {
  name = 'AddSellerToUser1705597259568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" ADD "seller_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_a6a1e36418153b93e2bab1ca4f6" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_a6a1e36418153b93e2bab1ca4f6"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "seller_id"`);
  }
}
