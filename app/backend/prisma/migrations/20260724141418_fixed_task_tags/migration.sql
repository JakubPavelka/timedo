/*
  Warnings:

  - A unique constraint covering the columns `[userId,label]` on the table `TaskTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `TaskTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskTag" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TaskTag_userId_label_key" ON "TaskTag"("userId", "label");

-- AddForeignKey
ALTER TABLE "TaskTag" ADD CONSTRAINT "TaskTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
