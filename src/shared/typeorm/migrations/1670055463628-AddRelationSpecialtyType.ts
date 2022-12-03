import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddRelationSpecialtyType1670055463628
  implements MigrationInterface
{
  name = 'AddRelationSpecialtyType1670055463628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD "professional_type_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "professional_specialty_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_ca167861b2915db2ad1afcb2387" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP CONSTRAINT "FK_ca167861b2915db2ad1afcb2387"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "professional_specialty_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_c62e5b404e2e9920d129d9176fc" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "professional_type_id"`,
    );
  }
}
