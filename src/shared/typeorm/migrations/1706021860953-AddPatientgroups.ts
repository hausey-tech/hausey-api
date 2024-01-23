import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatientgroups1706021860953 implements MigrationInterface {
  name = 'AddPatientgroups1706021860953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_85094e79a5443171e2e9d401acd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_group_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_group_id" character varying NOT NULL, "group_type_id" uuid NOT NULL, "patient_id" uuid, CONSTRAINT "PK_a18e78f8257478ba7738e195c1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "observations" character varying NOT NULL, "patient_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_1f13e325125f70d896cd15f28ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_professional_assistance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "role_id" uuid NOT NULL, "assistance_type" character varying NOT NULL, CONSTRAINT "PK_6a64108b7a3b20fc1f0e635ef70" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "clinical_resume_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_types" ADD CONSTRAINT "FK_8c662e88b950221e08ae7e9f609" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD CONSTRAINT "FK_cd25ff4347d2dd7b7086c52fe95" FOREIGN KEY ("patient_id") REFERENCES "patient_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD CONSTRAINT "FK_b5428dfdd171952d9dafa5d0b39" FOREIGN KEY ("group_type_id") REFERENCES "group_types"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group" ADD CONSTRAINT "FK_5b30b58d2e51ee63c4d20eb38da" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group" ADD CONSTRAINT "FK_b1047f2926d5f1c1a839c74b2a0" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" ADD CONSTRAINT "FK_78115541a090de8b24dfefd22a4" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" ADD CONSTRAINT "FK_026e3aaa9d7c193c4d6015280a9" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" DROP CONSTRAINT "FK_026e3aaa9d7c193c4d6015280a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" DROP CONSTRAINT "FK_78115541a090de8b24dfefd22a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group" DROP CONSTRAINT "FK_b1047f2926d5f1c1a839c74b2a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group" DROP CONSTRAINT "FK_5b30b58d2e51ee63c4d20eb38da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP CONSTRAINT "FK_b5428dfdd171952d9dafa5d0b39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP CONSTRAINT "FK_cd25ff4347d2dd7b7086c52fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_types" DROP CONSTRAINT "FK_8c662e88b950221e08ae7e9f609"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "clinical_resume_id" character varying`,
    );
    await queryRunner.query(`DROP TABLE "patient_professional_assistance"`);
    await queryRunner.query(`DROP TABLE "patient_group"`);
    await queryRunner.query(`DROP TABLE "patient_group_type"`);
    await queryRunner.query(`DROP TABLE "group_types"`);
  }
}
