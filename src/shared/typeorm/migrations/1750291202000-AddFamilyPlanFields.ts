import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFamilyPlanFields1750291202000 implements MigrationInterface {
  name = 'AddFamilyPlanFields1750291202000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "type" character varying(20) NOT NULL DEFAULT 'individual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "max_dependents" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "plans"."type" IS 'individual | family'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "plans"."max_dependents" IS '0 para individual, N para familiar (3, 5, etc)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "max_dependents"`);
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "type"`);
  }
}
