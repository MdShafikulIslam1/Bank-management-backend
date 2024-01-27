/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - The `gender` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenderTerm" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "user_name" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "GenderTerm" NOT NULL DEFAULT 'MALE';

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");
