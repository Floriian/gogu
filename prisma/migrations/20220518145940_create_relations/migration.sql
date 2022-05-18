/*
  Warnings:

  - You are about to drop the column `postId` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "postId";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
