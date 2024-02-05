import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponsibleTeamOnPatients1707169562289
  implements MigrationInterface
{
  name = 'AddResponsibleTeamOnPatients1707169562289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_02b6bf46bb0971bd4d612f32e6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "responsible_doctor_id" TO "responsible_team_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_2ceab86dff2b3b2e5648a395999" FOREIGN KEY ("responsible_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_2ceab86dff2b3b2e5648a395999"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" RENAME COLUMN "responsible_team_id" TO "responsible_doctor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_02b6bf46bb0971bd4d612f32e6e" FOREIGN KEY ("responsible_doctor_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
