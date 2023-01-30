import { MigrationInterface, QueryRunner } from 'typeorm';

export default class ReorderProfessionals1674913951720
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "registration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "registration_uf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "memed_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "registration" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "registration_uf" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "memed_status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "memed_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "registration_uf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "registration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "memed_status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "registration_uf" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "registration" character varying`,
    );
  }
}
