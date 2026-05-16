import { MigrationInterface, QueryRunner } from "typeorm";

export class FixIds1778968884605 implements MigrationInterface {
    name = 'FixIds1778968884605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Borrar datos con UUID para poder recrear las FK como integer
        await queryRunner.query(`TRUNCATE TABLE "product_images", "product_presentations", "products" CASCADE`);
        await queryRunner.query(`CREATE TABLE "tax_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_e55508e555edfdd379ff6772a47" UNIQUE ("code"), CONSTRAINT "PK_0eb0ecec0ae0c193f791057058a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "priceSale" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "taxTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606"`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" DROP CONSTRAINT "PK_ce93a9c86be10704b5415ca4bee"`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" ADD CONSTRAINT "PK_ce93a9c86be10704b5415ca4bee" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "PK_b0c437120b624da1034a81fc561"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_eb7aa5571360a623dc652aab641"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "PK_1974264ea7265989af8392f63a1"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "presentationId"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "presentationId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_ccedc9031459bff4e7870c70f13"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "productId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "unitOfMeasureId"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "unitOfMeasureId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brandId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "brandId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_eb7aa5571360a623dc652aab641" FOREIGN KEY ("presentationId") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_ccedc9031459bff4e7870c70f13" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_810697853ebfde220f18fe05429" FOREIGN KEY ("taxTypeId") REFERENCES "tax_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_810697853ebfde220f18fe05429"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_ccedc9031459bff4e7870c70f13"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_eb7aa5571360a623dc652aab641"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brandId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "brandId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "unitOfMeasureId"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "unitOfMeasureId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_ccedc9031459bff4e7870c70f13" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "presentationId"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "presentationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "PK_1974264ea7265989af8392f63a1"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_eb7aa5571360a623dc652aab641" FOREIGN KEY ("presentationId") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "PK_b0c437120b624da1034a81fc561"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" DROP CONSTRAINT "PK_ce93a9c86be10704b5415ca4bee"`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "units_of_measure" ADD CONSTRAINT "PK_ce93a9c86be10704b5415ca4bee" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "taxTypeId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "priceSale"`);
        await queryRunner.query(`DROP TABLE "tax_types"`);
    }

}
