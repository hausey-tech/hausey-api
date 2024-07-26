import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialtyOnPatientProfessionalAssistance1722001371836
  implements MigrationInterface
{
  name = 'AddSpecialtyOnPatientProfessionalAssistance1722001371836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" ADD "specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" ADD CONSTRAINT "FK_573c714a87ff224d2d2fea99937" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" DROP CONSTRAINT "FK_573c714a87ff224d2d2fea99937"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_professional_assistance" DROP COLUMN "specialty_id"`,
    );
  }
}
