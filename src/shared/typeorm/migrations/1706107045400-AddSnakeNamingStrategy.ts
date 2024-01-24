import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSnakeNamingStrategy1706107045400 implements MigrationInterface {
  name = 'AddSnakeNamingStrategy1706107045400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_2c2cd311e559d1a9e425de7b597"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaireAnswered"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "fcmToken"`);
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "clinical_resume_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "UQ_2c2cd311e559d1a9e425de7b597"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "medicalRecordId"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "roomId"`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaire_answered" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "fcm_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "room_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "medical_record_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "UQ_4f3449db6ec0fbf0864112ba524" UNIQUE ("medical_record_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_4f3449db6ec0fbf0864112ba524" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_4f3449db6ec0fbf0864112ba524"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "UQ_4f3449db6ec0fbf0864112ba524"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "medical_record_id"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "room_id"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "fcm_token"`);
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "questionnaire_answered"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "roomId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "medicalRecordId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "UQ_2c2cd311e559d1a9e425de7b597" UNIQUE ("medicalRecordId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "clinical_resume_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "fcmToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "questionnaireAnswered" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_2c2cd311e559d1a9e425de7b597" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
