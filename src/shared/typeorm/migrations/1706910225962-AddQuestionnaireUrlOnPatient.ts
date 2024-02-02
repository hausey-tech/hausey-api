import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionnaireUrlOnPatient1706910225962
  implements MigrationInterface
{
  name = 'AddQuestionnaireUrlOnPatient1706910225962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "questionnaire_answered" TO "questionnaire_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaire_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaire_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaire_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaire_url" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "questionnaire_url" TO "questionnaire_answered"`,
    );
  }
}
