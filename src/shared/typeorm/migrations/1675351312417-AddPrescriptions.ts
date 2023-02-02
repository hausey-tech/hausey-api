import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddPrescriptions1675351312417
  implements MigrationInterface
{
  name = 'AddPrescriptions1675351312417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prescriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "appointment_id" uuid NOT NULL, "external_id" character varying NOT NULL, "pdf_url" character varying NOT NULL, CONSTRAINT "PK_097b2cc2f2b7e56825468188503" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_94491da15bc982f3435690fc96e" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_94491da15bc982f3435690fc96e"`,
    );
    await queryRunner.query(`DROP TABLE "prescriptions"`);
  }
}
