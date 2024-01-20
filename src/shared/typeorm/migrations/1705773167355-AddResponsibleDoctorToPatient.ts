import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponsibleDoctorToPatient1705773167355
  implements MigrationInterface
{
  name = 'AddResponsibleDoctorToPatient1705773167355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "responsible_doctor_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_02b6bf46bb0971bd4d612f32e6e" FOREIGN KEY ("responsible_doctor_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_02b6bf46bb0971bd4d612f32e6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "responsible_doctor_id"`,
    );
  }
}
