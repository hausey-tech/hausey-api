import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddSpecialtyAndTypeOnAppointment1670059682170
  implements MigrationInterface
{
  name = 'AddSpecialtyAndTypeOnAppointment1670059682170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "professional_type_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "professional_specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_60b7a60cf6727d87d525a750414"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "professional_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_cdf08e9505cf9c9f24534e247f1" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_8320f43845ec30db0caeb0d240a" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_60b7a60cf6727d87d525a750414" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_60b7a60cf6727d87d525a750414"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_8320f43845ec30db0caeb0d240a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_cdf08e9505cf9c9f24534e247f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "professional_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_60b7a60cf6727d87d525a750414" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "professional_type_id"`,
    );
  }
}
