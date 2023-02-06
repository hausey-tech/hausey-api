import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropSpecialtyFromProfessionals1675107153984
  implements MigrationInterface
{
  name = 'DropSpecialtyFromProfessionals1675107153984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_bf66c09f8b5616c00096f1833a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "specialty_registration"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "specialty_registration" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "specialty_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_bf66c09f8b5616c00096f1833a3" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
