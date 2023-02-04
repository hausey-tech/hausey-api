import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropAddressIdFromPatient1675523805043
  implements MigrationInterface
{
  name = 'DropAddressIdFromPatient1675523805043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "address_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" ADD "address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
