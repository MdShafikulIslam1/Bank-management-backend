import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { TransactionType } from '@prisma/client';

const transferMoney = async (payload: {
  amount: number;
  sender_id: string;
  receiver_id: string;
}) => {
  const { amount, sender_id, receiver_id } = payload;

  if (!sender_id || !receiver_id) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'amount and sender_id and receiver must be provided'
    );
  }

  const isExistSender = await prisma.user.findFirst({
    where: {
      id: sender_id,
    },
  });

  const isExistReceiver = await prisma.user.findFirst({
    where: {
      id: receiver_id,
    },
  });

  if (!isExistSender || !isExistReceiver) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'sender_id and receiver_id not found'
    );
  }

  if (amount < 100) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'amount must be greater than 100'
    );
  }

  if (amount > isExistSender.account_balance) {
    throw new ApiError(
      httpStatus.INSUFFICIENT_STORAGE,
      `you don't have enough funds. Your current balance is = ${isExistSender.account_balance} tk`
    );
  }

  const lastTransfer = await prisma.transfer.findFirst({
    where: {
      sender_id,
      created_at: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
    },
  });

  if (lastTransfer) {
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      'You cannot transfer money more than once within 5 minutes.'
    );
  }

  const transferMoney = await prisma.$transaction(async ts => {
    // CREATE TRANSACTION FOR SENDER
    await ts.transaction.create({
      data: {
        amount,
        user_id: isExistSender.id,
        transaction_type: TransactionType.TRANSFER,
      },
    });

    // UPDATE SENDER ACCOUNT BALANCE
    await ts.user.update({
      where: {
        id: sender_id,
      },
      data: {
        account_balance: isExistSender.account_balance - amount,
      },
    });

    // CREATE TRANSACTION FOR RECEIVER
    await ts.transaction.create({
      data: {
        amount,
        user_id: isExistReceiver.id,
        transaction_type: TransactionType.TRANSFER,
      },
    });

    // UPDATE RECEIVER ACCOUNT BALANCE
    await ts.user.update({
      where: {
        id: receiver_id,
      },
      data: {
        account_balance: isExistReceiver.account_balance + amount,
      },
    });

    // CREATE TRANSFER RECORD
    const moneyTransfer = await ts.transfer.create({
      data: {
        amount,
        sender_id,
        receiver_id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return moneyTransfer;
  });

  return transferMoney;
};

export const TransferMoneyService = {
  transferMoney,
};
