import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColorsAndProductColors1779080000000 implements MigrationInterface {
  name = 'AddColorsAndProductColors1779080000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "colors" (
        "id"          SERIAL NOT NULL,
        "name"        character varying(100) NOT NULL,
        "hex"         character varying(7)  NOT NULL,
        "colorFamily" character varying(50),
        "code"        character varying(50),
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP DEFAULT now(),
        CONSTRAINT "UQ_colors_code" UNIQUE ("code"),
        CONSTRAINT "PK_colors" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product_colors" (
        "productId" integer NOT NULL,
        "colorId"   integer NOT NULL,
        CONSTRAINT "PK_product_colors" PRIMARY KEY ("productId", "colorId")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_product_colors_productId" ON "product_colors" ("productId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_colors_colorId" ON "product_colors" ("colorId")`,
    );

    await queryRunner.query(`
      ALTER TABLE "product_colors"
        ADD CONSTRAINT "FK_product_colors_product"
        FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "product_colors"
        ADD CONSTRAINT "FK_product_colors_color"
        FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_colors" DROP CONSTRAINT IF EXISTS "FK_product_colors_color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_colors" DROP CONSTRAINT IF EXISTS "FK_product_colors_product"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_colors_colorId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_colors_productId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_colors"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "colors"`);
  }
}
