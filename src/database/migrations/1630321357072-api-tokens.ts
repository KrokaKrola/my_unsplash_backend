import {MigrationInterface, QueryRunner} from "typeorm";

export class apiTokens1630321357072 implements MigrationInterface {
    name = 'apiTokens1630321357072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api-tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_6bd857e25addbab3d71fff68c49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "api-tokens" ADD CONSTRAINT "FK_f072021489ff7fd4d916236ab83" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api-tokens" DROP CONSTRAINT "FK_f072021489ff7fd4d916236ab83"`);
        await queryRunner.query(`DROP TABLE "api-tokens"`);
    }

}
