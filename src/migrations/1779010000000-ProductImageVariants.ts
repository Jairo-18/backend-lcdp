import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductImageVariants1779010000000 implements MigrationInterface {
    name = 'ProductImageVariants1779010000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "variants" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "variants"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "url" character varying(500) NOT NULL DEFAULT ''`);
    }
}
