-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_commentId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
