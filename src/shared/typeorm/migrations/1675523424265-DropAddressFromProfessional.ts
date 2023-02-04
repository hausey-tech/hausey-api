import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropAddressFromProfessional1675523424265
  implements MigrationInterface
{
  name = 'DropAddressFromProfessional1675523424265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_69412afb9c3f98c19376d51c1f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "REL_69412afb9c3f98c19376d51c1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP COLUMN "professional_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "address_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "address_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "professional_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "REL_69412afb9c3f98c19376d51c1f" UNIQUE ("professional_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_69412afb9c3f98c19376d51c1f7" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
