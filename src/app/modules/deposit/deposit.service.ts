import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';
import { IDepositFilterRequest } from './deposit.interface';
import { IPaginationOptions } from '../../../interfaces/paginationOptions';
import { IGenericResponse } from '../../../interfaces/common';
import { Deposit, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { depositSearchableFields } from './deposit.constant';

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

const getAll = async (
  filters: IDepositFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Deposit[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: depositSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DepositWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.deposit.findMany({
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
  const total = await prisma.deposit.count({
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

export const DepositService = {
  addDeposit,
  getAll,
};
