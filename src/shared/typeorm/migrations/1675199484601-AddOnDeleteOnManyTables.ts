import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddOnDeleteOnManyTables1675199484601
  implements MigrationInterface
{
  name = 'AddOnDeleteOnManyTables1675199484601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_60b7a60cf6727d87d525a750414"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" DROP CONSTRAINT "FK_61970be474d532deb78a2900855"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_programs" DROP CONSTRAINT "FK_f3cafb82622415e0dbc593eec2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_60b7a60cf6727d87d525a750414" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" ADD CONSTRAINT "FK_61970be474d532deb78a2900855" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_programs" ADD CONSTRAINT "FK_f3cafb82622415e0dbc593eec2c" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_programs" DROP CONSTRAINT "FK_f3cafb82622415e0dbc593eec2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" DROP CONSTRAINT "FK_61970be474d532deb78a2900855"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_60b7a60cf6727d87d525a750414"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_programs" ADD CONSTRAINT "FK_f3cafb82622415e0dbc593eec2c" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" ADD CONSTRAINT "FK_61970be474d532deb78a2900855" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_60b7a60cf6727d87d525a750414" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
