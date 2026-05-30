import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveAndCertifications1779090000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "colors" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "tax_types" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "units_of_measure" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "certifications" (
        "id" SERIAL NOT NULL,
        "name" varchar(200) NOT NULL,
        "normCode" varchar(100) NOT NULL,
        "certifyingBody" varchar(200),
        "description" text,
        "imageUrl" varchar(500),
        "isActive" boolean NOT NULL DEFAULT true,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "PK_certifications" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "certifications"`);
    await queryRunner.query(`ALTER TABLE "units_of_measure" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "tax_types" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "colors" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN IF EXISTS "isActive"`);
  }
}
