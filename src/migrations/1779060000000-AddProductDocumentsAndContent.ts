import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductDocumentsAndContent1779060000000 implements MigrationInterface {
  name = 'AddProductDocumentsAndContent1779060000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old JSONB technicalSheet (key-value specs — no longer used)
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "technicalSheet"`,
    );

    // New field: technicalSheet (PDF URL, varchar)
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "technicalSheet" character varying(500)`,
    );

    // New field: safetySheet (PDF URL, varchar)
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "safetySheet" character varying(500)`,
    );

    // New field: modeOfUse (text)
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "modeOfUse" text`,
    );

    // New field: performance (varchar)
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "performance" character varying(300)`,
    );

    // New field: benefits (text)
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "benefits" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "benefits"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "performance"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "modeOfUse"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "safetySheet"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "technicalSheet"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "technicalSheet" jsonb`,
    );
  }
}
