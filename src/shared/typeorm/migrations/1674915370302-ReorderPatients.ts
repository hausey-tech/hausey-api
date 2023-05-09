import { MigrationInterface, QueryRunner } from 'typeorm';

export default class ReorderPatients1674915370302
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "plan_id"`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "plan_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "plan_id"`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "plan_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
