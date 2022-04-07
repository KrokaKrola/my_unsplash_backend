/*
  Warnings:

  - The `imageStatus` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Mail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `postId` on the `Pet` table. All the data in the column will be lost.
  - Changed the type of `imageType` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `imageId` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageStatusEnum" AS ENUM ('processing', 'optimized', 'error');

-- CreateEnum
CREATE TYPE "ImageTypeEnum" AS ENUM ('jpg', 'jpeg', 'png');

-- CreateEnum
CREATE TYPE "MailStatusEnum" AS ENUM ('pending', 'processing', 'sent', 'failed');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_petId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imageStatus",
ADD COLUMN     "imageStatus" "ImageStatusEnum" NOT NULL DEFAULT E'processing',
DROP COLUMN "imageType",
ADD COLUMN     "imageType" "ImageTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Mail" DROP COLUMN "status",
ADD COLUMN     "status" "MailStatusEnum" NOT NULL DEFAULT E'pending';

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "postId",
ADD COLUMN     "imageId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "images_imagestatus_enum";

-- DropEnum
DROP TYPE "images_imagetype_enum";

-- DropEnum
DROP TYPE "mails_status_enum";

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
