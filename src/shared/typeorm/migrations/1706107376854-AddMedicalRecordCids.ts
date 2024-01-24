import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMedicalRecordCids1706107376854 implements MigrationInterface {
  name = 'AddMedicalRecordCids1706107376854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_records" DROP CONSTRAINT "FK_31bef5f9acc117db52116ee09be"`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_record_cids" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cid" character varying NOT NULL, "medical_record_id" uuid, CONSTRAINT "PK_819a622c01a7e3317b489ba000c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" DROP CONSTRAINT "REL_31bef5f9acc117db52116ee09b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" DROP COLUMN "appointmentId"`,
    );
    await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "cid"`);
    await queryRunner.query(
      `ALTER TABLE "medical_record_cids" ADD CONSTRAINT "FK_57105e50e6751826b7d18de4951" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_record_cids" DROP CONSTRAINT "FK_57105e50e6751826b7d18de4951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" ADD "cid" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" ADD "appointmentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_records" ADD CONSTRAINT "REL_31bef5f9acc117db52116ee09b" UNIQUE ("appointmentId")`,
    );
    await queryRunner.query(`DROP TABLE "medical_record_cids"`);
    await queryRunner.query(
      `ALTER TABLE "medical_records" ADD CONSTRAINT "FK_31bef5f9acc117db52116ee09be" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
