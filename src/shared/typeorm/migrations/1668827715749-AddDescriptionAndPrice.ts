import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddDescriptionAndPrice1668827715749
  implements MigrationInterface
{
  name = 'AddDescriptionAndPrice1668827715749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD "price" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_types" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_types" ADD "price" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_types" DROP COLUMN "price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_types" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "description"`,
    );
  }
}
