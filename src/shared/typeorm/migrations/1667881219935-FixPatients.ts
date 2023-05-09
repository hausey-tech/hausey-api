import { MigrationInterface, QueryRunner } from 'typeorm';

export default class FixPatients1667881219935 implements MigrationInterface {
  name = 'FixPatients1667881219935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "REL_8a072c34140bcb19bd70da165e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "REL_8a072c34140bcb19bd70da165e" UNIQUE ("plan_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
