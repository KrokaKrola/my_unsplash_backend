import {MigrationInterface, QueryRunner} from "typeorm";

export class user1648923020561 implements MigrationInterface {
    name = 'user1648923020561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email-verifications" DROP CONSTRAINT "FK_c71c408704382d6dc4f0daa032a"`);
        await queryRunner.query(`CREATE TYPE "public"."mails_status_enum" AS ENUM('pending', 'processing', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "mails" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."mails_status_enum" NOT NULL DEFAULT 'pending', "info" json, CONSTRAINT "PK_218248d7dfe1b739f06e2309349" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(128) NOT NULL, "lastName" character varying(256) NOT NULL, "email" character varying(256) NOT NULL, "username" character varying(64) NOT NULL, "password" character varying(128) NOT NULL, "currentHashedRefreshToken" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "registration-candidate" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "registration-candidate" DROP CONSTRAINT "UQ_092f8efdeace8ddbd39a9236bb3"`);
        await queryRunner.query(`ALTER TABLE "email-verifications" ADD CONSTRAINT "FK_c71c408704382d6dc4f0daa032a" FOREIGN KEY ("mailId") REFERENCES "mails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email-verifications" DROP CONSTRAINT "FK_c71c408704382d6dc4f0daa032a"`);
        await queryRunner.query(`ALTER TABLE "registration-candidate" ADD CONSTRAINT "UQ_092f8efdeace8ddbd39a9236bb3" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "registration-candidate" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "mails"`);
        await queryRunner.query(`DROP TYPE "public"."mails_status_enum"`);
        await queryRunner.query(`ALTER TABLE "email-verifications" ADD CONSTRAINT "FK_c71c408704382d6dc4f0daa032a" FOREIGN KEY ("mailId") REFERENCES "emails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
