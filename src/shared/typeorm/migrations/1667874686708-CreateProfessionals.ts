import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateProfessionals1667874686708
  implements MigrationInterface
{
  name = 'CreateProfessionals1667874686708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "professional_specialties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_446fc7b1135555310856aabfefb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "professional_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_e3d58588a20dd763e47e7fd3efe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "professionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "professional_specialty_id" uuid NOT NULL, "registration" character varying NOT NULL, "registration_uf" character varying NOT NULL, "professional_type_id" uuid NOT NULL, CONSTRAINT "REL_11ce20e0e9f03ab6ce35e95a61" UNIQUE ("user_id"), CONSTRAINT "PK_d7dc8473b49fcd938def2799387" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_11ce20e0e9f03ab6ce35e95a615" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_e3fe038a7d439db7aad66a86d44" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_e3fe038a7d439db7aad66a86d44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_11ce20e0e9f03ab6ce35e95a615"`,
    );
    await queryRunner.query(`DROP TABLE "professionals"`);
    await queryRunner.query(`DROP TABLE "professional_types"`);
    await queryRunner.query(`DROP TABLE "professional_specialties"`);
  }
}
