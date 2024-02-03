/*
  Warnings:

  - You are about to drop the column `creaed_at` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `creaed_at` on the `deposits` table. All the data in the column will be lost.
  - You are about to drop the column `creaed_at` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `creaed_at` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `creaed_at` on the `withdrawals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "creaed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "creaed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "creaed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "creaed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "withdrawals" DROP COLUMN "creaed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
