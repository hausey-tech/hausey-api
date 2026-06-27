import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsProAndTypeToPlanAndPatient1750000000000
  implements MigrationInterface
{
  name = 'AddIsProAndTypeToPlanAndPatient1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "is_pro" boolean NOT NULL DEFAULT false`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "plans" ADD "type" character varying NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "is_pro" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `UPDATE "plans" SET "is_pro" = true, "type" = 'individual' WHERE "id" = '938ef52c-bd6a-4e21-a6e5-e2eba8b5e60f'`,
    );
    await queryRunner.query(
      `UPDATE "plans" SET "is_pro" = true, "type" = 'family' WHERE "name" ILIKE '%Familiar%'`,
    );
    await queryRunner.query(
      `UPDATE "patients" SET "is_pro" = true WHERE "plan_id" IN (SELECT "id" FROM "plans" WHERE "is_pro" = true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "is_pro"`);
    // await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "is_pro"`);
  }
}
