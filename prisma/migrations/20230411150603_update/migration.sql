/*
  Warnings:

  - You are about to drop the column `stile` on the `DanceStyles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Descriptions` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Descriptions` table. All the data in the column will be lost.
  - You are about to drop the column `styleId` on the `Descriptions` table. All the data in the column will be lost.
  - You are about to drop the column `videoLink` on the `Descriptions` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionId` on the `MasterClasses` table. All the data in the column will be lost.
  - You are about to drop the column `evenDate` on the `MasterClasses` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `MasterClasses` table. All the data in the column will be lost.
  - Added the required column `style` to the `DanceStyles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Descriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evenDate` to the `Descriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Descriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `MasterClasses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `styleId` to the `MasterClasses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoLink` to the `MasterClasses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MasterClasses" DROP CONSTRAINT "MasterClasses_descriptionId_fkey";

-- AlterTable
ALTER TABLE "DanceStyles" DROP COLUMN "stile",
ADD COLUMN     "style" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Descriptions" DROP COLUMN "description",
DROP COLUMN "price",
DROP COLUMN "styleId",
DROP COLUMN "videoLink",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "evenDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "place" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterClasses" DROP COLUMN "descriptionId",
DROP COLUMN "evenDate",
DROP COLUMN "place",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD COLUMN     "videoLink" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MasterClasses" ADD CONSTRAINT "MasterClasses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Descriptions" ADD CONSTRAINT "Descriptions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "MasterClasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
