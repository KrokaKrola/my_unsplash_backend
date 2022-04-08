-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_petTypeId_fkey";

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "petTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_petTypeId_fkey" FOREIGN KEY ("petTypeId") REFERENCES "PetType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
