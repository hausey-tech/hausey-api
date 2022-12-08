import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddHasSpecialtiesOnType1670513152579
  implements MigrationInterface
{
  name = 'AddHasSpecialtiesOnType1670513152579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_types" ADD "has_specialties" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_types" DROP COLUMN "has_specialties"`,
    );
  }
}
