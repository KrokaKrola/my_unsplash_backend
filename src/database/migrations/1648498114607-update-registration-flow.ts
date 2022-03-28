import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateRegistrationFlow1648498114607 implements MigrationInterface {
  name = 'updateRegistrationFlow1648498114607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "emails_status_enum" AS ENUM('pending', 'processing', 'sent', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "emails" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "emails_status_enum" NOT NULL DEFAULT 'pending', "info" json, CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email-verifications" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "code" character varying(6) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailId" integer, CONSTRAINT "REL_c71c408704382d6dc4f0daa032" UNIQUE ("mailId"), CONSTRAINT "PK_9ede3b65e24b51735f62662d6f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "registration-candidate" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(128) NOT NULL, "lastName" character varying(256), "email" character varying(256) NOT NULL, "username" character varying(64) NOT NULL, "password" character varying(128) NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "UQ_092f8efdeace8ddbd39a9236bb3" UNIQUE ("username"), CONSTRAINT "PK_311762929615a9be0b20f05a3fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-verifications" ADD CONSTRAINT "FK_c71c408704382d6dc4f0daa032a" FOREIGN KEY ("mailId") REFERENCES "emails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-verifications" DROP CONSTRAINT "FK_c71c408704382d6dc4f0daa032a"`,
    );
    await queryRunner.query(`DROP TABLE "registration-candidate"`);
    await queryRunner.query(`DROP TABLE "email-verifications"`);
    await queryRunner.query(`DROP TABLE "emails"`);
    await queryRunner.query(`DROP TYPE "emails_status_enum"`);
  }
}
