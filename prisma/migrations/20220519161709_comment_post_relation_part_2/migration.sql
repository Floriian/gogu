/*
  Warnings:

  - You are about to drop the `_CommentToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommentToPost" DROP CONSTRAINT "_CommentToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToPost" DROP CONSTRAINT "_CommentToPost_B_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "commentId" INTEGER;

-- DropTable
DROP TABLE "_CommentToPost";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
