import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePatientEmailNullable1750291201000
  implements MigrationInterface
{
  name = 'MakePatientEmailNullable1750291201000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "patients" SET "email" = CONCAT('no-email-', id, '@placeholder.invalid') WHERE "email" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
