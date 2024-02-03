import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';
import { TransactionType } from '@prisma/client';

const addWithdraw = async (payload: { user_id: string; amount: number }) => {
  const { user_id, amount } = payload;

  // Find the user and related deposits
  const isExistUser = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      account_balance: true,
    },
  });

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (amount > isExistUser?.account_balance) {
    throw new ApiError(httpStatus.INSUFFICIENT_STORAGE, 'Insufficient funds');
  }

  // Calculate the new total_amount by adding the amount to the existing total_amount
  const newTotalAmount = isExistUser.account_balance - amount;

  // Create a new deposit record

  const withdraw = await prisma.$transaction(async ts => {
    await ts.transaction.create({
      data: {
        amount,
        user_id: isExistUser.id,
        transaction_type: TransactionType.WITHDRAWAL,
      },
    });
    await ts.user.update({
      where: {
        id: isExistUser.id,
      },
      data: {
        account_balance: newTotalAmount,
      },
    });
    const result = await ts.withdrawal.create({
      data: {
        amount,
        user_id: isExistUser.id,
        rest_amount: newTotalAmount,
      },
      include: {
        user: true,
      },
    });

    await ts.deposit.updateMany({
      where: {
        user_id: isExistUser.id,
      },
      data: {
        total_amount: newTotalAmount,
      },
    });

    return result;
  });
  return withdraw;
};

export const WithdrawService = {
  addWithdraw,
};
