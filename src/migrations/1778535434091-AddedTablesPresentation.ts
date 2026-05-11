import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTablesPresentation1778535434091 implements MigrationInterface {
    name = 'AddedTablesPresentation1778535434091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_e69ad885748544ae72ff9cf62d3"`);
        await queryRunner.query(`ALTER TABLE "product_images" RENAME COLUMN "productId" TO "presentationId"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "unitOfMeasureId" TO "brandId"`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_1687d82f42d8b3f8162a29e7df4" UNIQUE ("code"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_presentations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "unitOfMeasureId" uuid NOT NULL, "sku" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizational" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "legalName" character varying(150), "nit" character varying(50), "email" character varying(150), "phone" character varying(25), "whatsappNumber" character varying(25), "website" character varying(200), "address" character varying(200), "city" character varying(100), "department" character varying(100), "logoUrl" character varying(500), "faviconUrl" character varying(500), "primaryColor" character varying(20), "secondaryColor" character varying(20), "accentColor" character varying(20), "bgColor" character varying(20), "textColor" character varying(20), "facebookUrl" character varying(500), "instagramUrl" character varying(500), "youtubeUrl" character varying(500), "tiktokUrl" character varying(500), "mapsUrl" character varying(500), "description" text, "aboutTitle" character varying(200), "aboutDescription" text, "missionTitle" character varying(200), "missionDescription" text, "visionTitle" character varying(200), "visionDescription" text, "metaTitle" character varying(200), "metaDescription" text, "metaKeywords" character varying(500), "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b6c9f02eeb7ca92136f9a9e43f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_eb7aa5571360a623dc652aab641" FOREIGN KEY ("presentationId") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_ccedc9031459bff4e7870c70f13" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_ccedc9031459bff4e7870c70f13"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_eb7aa5571360a623dc652aab641"`);
        await queryRunner.query(`DROP TABLE "organizational"`);
        await queryRunner.query(`DROP TABLE "product_presentations"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "brandId" TO "unitOfMeasureId"`);
        await queryRunner.query(`ALTER TABLE "product_images" RENAME COLUMN "presentationId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_e69ad885748544ae72ff9cf62d3" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
