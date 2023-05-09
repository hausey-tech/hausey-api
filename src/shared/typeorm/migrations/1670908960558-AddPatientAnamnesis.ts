import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddPatientAnamnesis1670908960558
  implements MigrationInterface
{
  name = 'AddPatientAnamnesis1670908960558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "patient_anamneses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "appointment_id" uuid NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_441aa1974e2d47a35ea4749204b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_anamneses" ADD CONSTRAINT "FK_c3b544ac8c1c5f2f0c1a9ee530a" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_anamneses" ADD CONSTRAINT "FK_65903c8cb35d27bc7ecbeee1119" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_anamneses" DROP CONSTRAINT "FK_65903c8cb35d27bc7ecbeee1119"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_anamneses" DROP CONSTRAINT "FK_c3b544ac8c1c5f2f0c1a9ee530a"`,
    );
    await queryRunner.query(`DROP TABLE "patient_anamneses"`);
  }
}
