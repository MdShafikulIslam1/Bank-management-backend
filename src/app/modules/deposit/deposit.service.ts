import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';

const addDeposit = async (payload: { user_id: string; amount: number }) => {
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

  // Calculate the new total_amount by adding the amount to the existing total_amount
  const newTotalAmount = isExistUser.account_balance + amount;

  // Create a new deposit record

  const deposit = await prisma.$transaction(async ts => {
    await ts.user.update({
      where: {
        id: isExistUser.id,
      },
      data: {
        account_balance: newTotalAmount,
      },
    });

    await ts.transaction.create({
      data: {
        amount,
        user_id: isExistUser.id,
        transaction_type: 'DEPOSIT',
      },
    });

    const result = await ts.deposit.create({
      data: {
        amount,
        user_id: isExistUser.id,
        total_amount: newTotalAmount,
      },
      include: {
        user: true,
      },
    });

    await ts.withdrawal.updateMany({
      where: {
        user_id: isExistUser.id,
      },
      data: {
        rest_amount: newTotalAmount,
      },
    });

    return result;
  });
  return deposit;
};

export const DepositService = {
  addDeposit,
};
