import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAddress1675199230837 implements MigrationInterface {
  name = 'AddAddress1675199230837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "professional_id" uuid, "patient_id" uuid, "address_line_1" character varying(50) NOT NULL, "address_line_2" character varying(50), "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_or_postcode" character varying, "country" character varying NOT NULL, CONSTRAINT "REL_69412afb9c3f98c19376d51c1f" UNIQUE ("professional_id"), CONSTRAINT "REL_09b38ef496156249e57ea965e8" UNIQUE ("patient_id"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "address_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea" UNIQUE ("address_id")`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_69412afb9c3f98c19376d51c1f7" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_09b38ef496156249e57ea965e8c" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_09b38ef496156249e57ea965e8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_69412afb9c3f98c19376d51c1f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "address_id"`);
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "address_id"`,
    );
    await queryRunner.query(`DROP TABLE "addresses"`);
  }
}
