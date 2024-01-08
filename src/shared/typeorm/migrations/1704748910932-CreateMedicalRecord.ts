import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicalRecord1704748910932 implements MigrationInterface {
  name = 'CreateMedicalRecord1704748910932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medical_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cid" character varying NOT NULL, "description" character varying NOT NULL, "appointmentId" uuid, CONSTRAINT "REL_31bef5f9acc117db52116ee09b" UNIQUE ("appointmentId"), CONSTRAINT "PK_c200c0b76638124b7ed51424823" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "medicalRecordId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "UQ_2c2cd311e559d1a9e425de7b597" UNIQUE ("medicalRecordId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" ADD CONSTRAINT "FK_31bef5f9acc117db52116ee09be" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_2c2cd311e559d1a9e425de7b597" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_2c2cd311e559d1a9e425de7b597"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" DROP CONSTRAINT "FK_31bef5f9acc117db52116ee09be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "UQ_2c2cd311e559d1a9e425de7b597"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "medicalRecordId"`,
    );
    await queryRunner.query(`DROP TABLE "medical_records"`);
  }
}
