import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeCustomerIdOnPatient1676401346510
  implements MigrationInterface
{
  name = 'AddStripeCustomerIdOnPatient1676401346510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "stripe_customer_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "stripe_customer_id"`,
    );
  }
}
