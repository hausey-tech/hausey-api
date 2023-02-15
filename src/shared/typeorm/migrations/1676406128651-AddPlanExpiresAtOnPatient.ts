import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlanExpiresAtOnPatient1676406128651
  implements MigrationInterface
{
  name = 'AddPlanExpiresAtOnPatient1676406128651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "plan_expires_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "plan_expires_at"`,
    );
  }
}
