import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddOnDeleteOnProfessionalSpecialty1675110398430
  implements MigrationInterface
{
  name = 'AddOnDeleteOnProfessionalSpecialty1675110398430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_df2ec3898f9c874a5e5278667f0" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_7ce1103c67ea34ec7c82115ff56" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
