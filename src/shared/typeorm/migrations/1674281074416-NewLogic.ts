import { MigrationInterface, QueryRunner } from 'typeorm';

export default class NewLogic1674281074416 implements MigrationInterface {
  name = 'NewLogic1674281074416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_8320f43845ec30db0caeb0d240a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" DROP CONSTRAINT "FK_79d6424464b7c3584c010540697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" DROP CONSTRAINT "FK_a5124c76ff01c22926ccf3bebd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" DROP CONSTRAINT "FK_16a870566191dabbe1bb2b969b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" DROP CONSTRAINT "FK_fc0c338ec9e568dc18fd65a1d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" RENAME COLUMN "professional_specialty_id" TO "specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" RENAME COLUMN "professional_specialty_id" TO "specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "REL_7fe1518dc780fd777669b5cb7a"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "professional_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "REL_11ce20e0e9f03ab6ce35e95a61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "professional_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "password" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "document" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "birthdate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "phone_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "sex" character varying(1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "password" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "document" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "birthdate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "phone_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "sex" character varying(1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "specialty_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "specialty_registration" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "specialty_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "registration" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "registration_uf" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_bf66c09f8b5616c00096f1833a3" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_64c155c6bf30a0834032551adc5" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" ADD CONSTRAINT "FK_4bb17035736b8ac2e3abd070367" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" ADD CONSTRAINT "FK_63724dc55d91939ffa99d635c0f" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" ADD CONSTRAINT "FK_ff48d1ba68b5dbf1b33ee65b837" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" ADD CONSTRAINT "FK_083d0f03300bb88facd34aecba5" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" DROP CONSTRAINT "FK_083d0f03300bb88facd34aecba5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" DROP CONSTRAINT "FK_ff48d1ba68b5dbf1b33ee65b837"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" DROP CONSTRAINT "FK_63724dc55d91939ffa99d635c0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" DROP CONSTRAINT "FK_4bb17035736b8ac2e3abd070367"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_64c155c6bf30a0834032551adc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_bf66c09f8b5616c00096f1833a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "registration_uf" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "registration" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "specialty_registration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "specialty_id"`,
    );
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "sex"`);
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "phone_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "birthdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "document"`,
    );
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "password"`,
    );
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "sex"`);
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "phone_number"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "birthdate"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "document"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "professional_type_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "professional_specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "REL_11ce20e0e9f03ab6ce35e95a61" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "professional_specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "professional_type_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "REL_7fe1518dc780fd777669b5cb7a" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" RENAME COLUMN "specialty_id" TO "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" RENAME COLUMN "specialty_id" TO "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" ADD CONSTRAINT "FK_fc0c338ec9e568dc18fd65a1d0a" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" ADD CONSTRAINT "FK_16a870566191dabbe1bb2b969b8" FOREIGN KEY ("professional_specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" ADD CONSTRAINT "FK_a5124c76ff01c22926ccf3bebd5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" ADD CONSTRAINT "FK_79d6424464b7c3584c010540697" FOREIGN KEY ("professional_specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_8320f43845ec30db0caeb0d240a" FOREIGN KEY ("professional_specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc" FOREIGN KEY ("professional_specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
