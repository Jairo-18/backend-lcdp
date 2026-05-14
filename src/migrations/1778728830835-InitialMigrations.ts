import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1778728830835 implements MigrationInterface {
    name = 'InitialMigrations1778728830835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "videos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "url" character varying(500) NOT NULL, "description" text, "youtubeId" character varying(50), "thumbnailUrl" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "fullName" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "units_of_measure" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_7a83359bddb3d311a7556e572d6" UNIQUE ("code"), CONSTRAINT "PK_ce93a9c86be10704b5415ca4bee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_77d7eff8a7aaa05457a12b8007a" UNIQUE ("code"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_1687d82f42d8b3f8162a29e7df4" UNIQUE ("code"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "presentationId" uuid NOT NULL, "url" character varying(500) NOT NULL, "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_presentations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "unitOfMeasureId" uuid NOT NULL, "sku" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4e91859a1485cf8c34aab3dcbf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" text, "categoryId" uuid NOT NULL, "brandId" uuid NOT NULL, "technicalSheet" jsonb, "videoUrl" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizational" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "legalName" character varying(150), "nit" character varying(50), "email" character varying(150), "phone" character varying(25), "whatsappNumber" character varying(25), "website" character varying(200), "address" character varying(200), "city" character varying(100), "department" character varying(100), "logoUrl" character varying(500), "faviconUrl" character varying(500), "primaryColor" character varying(20), "secondaryColor" character varying(20), "accentColor" character varying(20), "bgColor" character varying(20), "textColor" character varying(20), "facebookUrl" character varying(500), "instagramUrl" character varying(500), "youtubeUrl" character varying(500), "tiktokUrl" character varying(500), "mapsUrl" character varying(500), "description" text, "aboutTitle" character varying(200), "aboutDescription" text, "missionTitle" character varying(200), "missionDescription" text, "visionTitle" character varying(200), "visionDescription" text, "metaTitle" character varying(200), "metaDescription" text, "metaKeywords" character varying(500), "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b6c9f02eeb7ca92136f9a9e43f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accessSessions" ("id" uuid NOT NULL, "accessToken" character varying(2000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "PK_2f41d4ee773cd66f462be5ba209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_eb7aa5571360a623dc652aab641" FOREIGN KEY ("presentationId") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_ccedc9031459bff4e7870c70f13" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606" FOREIGN KEY ("unitOfMeasureId") REFERENCES "units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accessSessions" ADD CONSTRAINT "FK_e025653b9a3cd205c7c7b60040e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessSessions" DROP CONSTRAINT "FK_e025653b9a3cd205c7c7b60040e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_7949d68f76e7dc5d93c04a36606"`);
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP CONSTRAINT "FK_ccedc9031459bff4e7870c70f13"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_eb7aa5571360a623dc652aab641"`);
        await queryRunner.query(`DROP TABLE "accessSessions"`);
        await queryRunner.query(`DROP TABLE "organizational"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_presentations"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "units_of_measure"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "videos"`);
    }

}
