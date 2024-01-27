/*
  Warnings:

  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - Added the required column `primary_phone_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BUSINESS_ACCOUNT', 'STUDENT_ACCOUNT', 'CURRENT_ACCOUNT', 'SAVINGS_ACCOUNT');

-- CreateEnum
CREATE TYPE "BankRole" AS ENUM ('CUSTOMER', 'BANK_TELLER', 'CUSTOMER_SERVICE_REPRESENTATIVE', 'LOAN_OFFICER', 'BRANCH_MANAGER', 'RELATIONSHIP_MANAGER', 'RISK_MANAGER', 'COMPLIANCE_OFFICER', 'IT_PERSONNEL', 'INTERNAL_AUDITOR', 'CFO', 'BOARD_OF_DIRECTORS');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'LOAN');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('CREDIT', 'DEBIT', 'VISA', 'MASTER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone_number",
ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'SAVINGS_ACCOUNT',
ADD COLUMN     "creaed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "is_valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primary_phone_number" TEXT NOT NULL,
ADD COLUMN     "role" "BankRole" NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN     "secondary_phone_number" TEXT,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "account_balance" SET DEFAULT 0.00;

-- CreateTable
CREATE TABLE "withdrawals" (
    "withdrawal_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "rest_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "user_id" TEXT NOT NULL,
    "creaed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("withdrawal_id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "deposit_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "user_id" TEXT NOT NULL,
    "creaed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("deposit_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "user_id" TEXT NOT NULL,
    "creaed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "transfer_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "creaed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("transfer_id")
);

-- CreateTable
CREATE TABLE "Card" (
    "card_id" TEXT NOT NULL,
    "card_type" "CardType" NOT NULL DEFAULT 'CREDIT',
    "card_number" TEXT NOT NULL,
    "expiration_date" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("card_id")
);

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
