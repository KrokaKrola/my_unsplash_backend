import {MigrationInterface, QueryRunner} from "typeorm";

export class postsPetsImages1648927860019 implements MigrationInterface {
    name = 'postsPetsImages1648927860019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."images_imagestatus_enum" AS ENUM('processing', 'optimized', 'error')`);
        await queryRunner.query(`CREATE TYPE "public"."images_imagetype_enum" AS ENUM('jpg', 'jpeg', 'png')`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hash" character varying NOT NULL, "originalName" character varying NOT NULL, "cropSizes" json NOT NULL, "imageStatus" "public"."images_imagestatus_enum" NOT NULL DEFAULT 'processing', "imageType" "public"."images_imagetype_enum" NOT NULL, "originalSizes" character varying NOT NULL, "imageOptimizationLog" json, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pet_types" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_2a579366f5aa694149a21678cf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pets" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "bio" character varying(512) NOT NULL, "petTypeId" integer, "imageId" integer, CONSTRAINT "REL_f2924aee2c50e6189aea7ae611" UNIQUE ("petTypeId"), CONSTRAINT "REL_3906be203db2ba319c4aa84f13" UNIQUE ("imageId"), CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "viewsCount" integer NOT NULL DEFAULT '0', "likesCount" integer NOT NULL DEFAULT '0', "userId" integer, "categoryId" integer, "imageId" integer, "petId" integer, CONSTRAINT "REL_ae05faaa55c866130abef6e1fe" UNIQUE ("userId"), CONSTRAINT "REL_168bf21b341e2ae340748e2541" UNIQUE ("categoryId"), CONSTRAINT "REL_294625b251f17eca44cc57fbeb" UNIQUE ("imageId"), CONSTRAINT "REL_09a2a9477b6dbd5a033e4aa003" UNIQUE ("petId"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_f2924aee2c50e6189aea7ae611e" FOREIGN KEY ("petTypeId") REFERENCES "pet_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_3906be203db2ba319c4aa84f131" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_168bf21b341e2ae340748e2541d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_294625b251f17eca44cc57fbeb8" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_09a2a9477b6dbd5a033e4aa0038" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_09a2a9477b6dbd5a033e4aa0038"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_294625b251f17eca44cc57fbeb8"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_168bf21b341e2ae340748e2541d"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_3906be203db2ba319c4aa84f131"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_f2924aee2c50e6189aea7ae611e"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TABLE "pet_types"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TYPE "public"."images_imagetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."images_imagestatus_enum"`);
    }

}
