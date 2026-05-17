import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveSkuToProductCode1779020000000 implements MigrationInterface {
    name = 'MoveSkuToProductCode1779020000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "code" character varying(100)`);
        await queryRunner.query(`
            UPDATE "products"
            SET "code" = pp."sku"
            FROM "product_presentations" pp
            WHERE pp."productId" = "products"."id"
        `);
        await queryRunner.query(`UPDATE "product_presentations" SET "sku" = NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "product_presentations" pp
            SET "sku" = p."code"
            FROM "products" p
            WHERE pp."productId" = p."id"
        `);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "code"`);
    }
}
