import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedEmergencyToAppointment1706968502089
  implements MigrationInterface
{
  name = 'AddedEmergencyToAppointment1706968502089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "questionnaire_url" TO "questionnaire_answered"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "emergency" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaire_answered"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaire_answered" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaire_answered"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaire_answered" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "emergency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "questionnaire_answered" TO "questionnaire_url"`,
    );
  }
}
