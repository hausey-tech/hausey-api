import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultOnPrescriptions1675345087578
  implements MigrationInterface
{
  name = 'AddDefaultOnPrescriptions1675345087578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "prescriptions" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "prescriptions" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "prescriptions" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "prescriptions" DROP NOT NULL`,
    );
  }
}
