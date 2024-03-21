import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTeamResumeEntity1711046446868 implements MigrationInterface {
  name = 'AddedTeamResumeEntity1711046446868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_resumes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "observation" character varying NOT NULL, "file_url" character varying NOT NULL, "patient_id" uuid NOT NULL, "role_id" uuid NOT NULL, "professional_id" uuid NOT NULL, CONSTRAINT "PK_1eaa53c7503dbd71fe32a7fde00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ADD CONSTRAINT "FK_ca1cb22cdcc294ae6ab4c101943" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ADD CONSTRAINT "FK_de3ac10c46b277d5b677f486426" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ADD CONSTRAINT "FK_7c41b71a9b25314ed184581817b" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_resumes" DROP CONSTRAINT "FK_7c41b71a9b25314ed184581817b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" DROP CONSTRAINT "FK_de3ac10c46b277d5b677f486426"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" DROP CONSTRAINT "FK_ca1cb22cdcc294ae6ab4c101943"`,
    );
    await queryRunner.query(`DROP TABLE "team_resumes"`);
  }
}
