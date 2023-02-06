import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddProfessionalSpecialty1675103605296
  implements MigrationInterface
{
  name = 'AddProfessionalSpecialty1675103605296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "professional_specialties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "professional_id" uuid NOT NULL, "specialty_id" uuid NOT NULL, CONSTRAINT "PK_556fc7b1135555310856aabfefb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0"`,
    );
    await queryRunner.query(`DROP TABLE "professional_specialties"`);
  }
}
