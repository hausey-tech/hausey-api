import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWebhookEvents1751500000000 implements MigrationInterface {
  name = 'CreateWebhookEvents1751500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "webhook_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "provider" character varying NOT NULL,
        "event_id" character varying NOT NULL,
        "event_type" character varying NOT NULL,
        "processed_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_webhook_events" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_webhook_events_provider_event_id"
      ON "webhook_events" ("provider", "event_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_webhook_events_provider_event_id"`,
    );
    await queryRunner.query(`DROP TABLE "webhook_events"`);
  }
}
