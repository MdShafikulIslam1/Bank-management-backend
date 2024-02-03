/*
  Warnings:

  - The `transaction_type` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_type",
ADD COLUMN     "transaction_type" "TransactionType" NOT NULL DEFAULT 'DEPOSIT';
