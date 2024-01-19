import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedAppointmentEntity1705608789637
  implements MigrationInterface
{
  name = 'ChangedAppointmentEntity1705608789637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_64c155c6bf30a0834032551adc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "specialty_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_64c155c6bf30a0834032551adc5" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_64c155c6bf30a0834032551adc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "specialty_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_64c155c6bf30a0834032551adc5" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
