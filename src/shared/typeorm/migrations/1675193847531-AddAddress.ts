import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAddress1675193847531 implements MigrationInterface {
  name = 'AddAddress1675193847531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "address_line_1" character varying(50) NOT NULL, "address_line_2" character varying(50), "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_or_postcode" character varying, "country" character varying NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "address_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "UQ_0416ae389218cd75a2ce663e2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "address_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "UQ_f483f0de5daf9ee8cf5c95bf932"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "address_id"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
  }
}
