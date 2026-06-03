import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColorSurfaces1779110000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agrega la columna surfaces como text (simple-array de TypeORM usa text con valores separados por coma)
    await queryRunner.query(`
      ALTER TABLE "colors"
      ADD COLUMN IF NOT EXISTS "surfaces" text DEFAULT NULL
    `);

    // Por defecto todos los colores existentes quedan con 'pared'
    await queryRunner.query(`
      UPDATE "colors" SET "surfaces" = 'pared' WHERE "surfaces" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "colors" DROP COLUMN IF EXISTS "surfaces"`);
  }
}
