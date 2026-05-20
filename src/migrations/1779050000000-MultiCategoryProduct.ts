import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiCategoryProduct1779050000000 implements MigrationInterface {
  name = 'MultiCategoryProduct1779050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "categoryId" CASCADE`,
    );

    await queryRunner.query(`
      CREATE TABLE "product_categories" (
        "productId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        CONSTRAINT "PK_product_categories" PRIMARY KEY ("productId", "categoryId")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_product_categories_productId" ON "product_categories" ("productId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_categories_categoryId" ON "product_categories" ("categoryId")`,
    );

    await queryRunner.query(
      `ALTER TABLE "product_categories"
        ADD CONSTRAINT "FK_product_categories_product"
        FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories"
        ADD CONSTRAINT "FK_product_categories_category"
        FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(`
      INSERT INTO "product_categories" ("productId", "categoryId")
      SELECT id, 21 FROM "products"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "FK_product_categories_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "FK_product_categories_product"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "product_categories"`);

    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "categoryId" integer`,
    );
  }
}
