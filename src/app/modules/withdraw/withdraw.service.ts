import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';
import { Prisma, TransactionType, Withdrawal } from '@prisma/client';
import { IWithdrawFilterRequest } from './withdraw.interface';
import { IPaginationOptions } from '../../../interfaces/paginationOptions';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { withdrawSearchableFields } from './withdraw.constant';

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

const getAll = async (
  filters: IWithdrawFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Withdrawal[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: withdrawSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.WithdrawalWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.withdrawal.findMany({
    where: whereConditions,
    include: {
      user: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            created_at: 'desc',
          },
  });
  const total = await prisma.withdrawal.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const WithdrawService = {
  addWithdraw,
  getAll,
};
