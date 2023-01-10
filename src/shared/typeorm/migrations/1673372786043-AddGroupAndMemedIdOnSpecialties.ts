import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddGroupAndMemedIdOnSpecialties1673372786043
  implements MigrationInterface
{
  name = 'AddGroupAndMemedIdOnSpecialties1673372786043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD "group" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD "memed_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "memed_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "group"`,
    );
  }
}
