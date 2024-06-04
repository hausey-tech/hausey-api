import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatientFiles1717447779065 implements MigrationInterface {
  name = 'AddPatientFiles1717447779065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "patient_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_url" character varying NOT NULL, "patient_id" uuid NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_3bd24197d470559ed86ef22d3fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_files" ADD CONSTRAINT "FK_d592ab2fec0cf11e91f3d8d28c4" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_files" DROP CONSTRAINT "FK_d592ab2fec0cf11e91f3d8d28c4"`,
    );
    await queryRunner.query(`DROP TABLE "patient_files"`);
  }
}
