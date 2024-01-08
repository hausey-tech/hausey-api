import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClinicalResume1704750685035 implements MigrationInterface {
  name = 'CreateClinicalResume1704750685035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clinical_resumes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "clinical_resume" character varying NOT NULL, "terapeutic_plan" character varying NOT NULL, "patient_id" uuid NOT NULL, "category_id" uuid NOT NULL, "professional_id" uuid NOT NULL, CONSTRAINT "PK_32b5151ba09d1973190226007a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" ADD CONSTRAINT "FK_ff98c7036c22916f4471b123745" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" ADD CONSTRAINT "FK_ffc2e58791163168b36d2c8c275" FOREIGN KEY ("category_id") REFERENCES "clinical_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" ADD CONSTRAINT "FK_5ee5b02bd4976cadfcc984d1087" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" DROP CONSTRAINT "FK_5ee5b02bd4976cadfcc984d1087"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" DROP CONSTRAINT "FK_ffc2e58791163168b36d2c8c275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_resumes" DROP CONSTRAINT "FK_ff98c7036c22916f4471b123745"`,
    );
    await queryRunner.query(`DROP TABLE "clinical_resumes"`);
  }
}
