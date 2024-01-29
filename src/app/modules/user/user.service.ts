import { Prisma, User } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/paginationOptions';
import prisma from '../../../shared/prisma';
import { IUserFilterRequest } from './user.interface';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { userSearchableFields } from './user.constant';

const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    include: {
      cards: true,
      deposits: true,
      withdrawals: true,
      transactions: true,
      transfersReceived: true,
      transfersSent: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            created_at: 'desc',
          },
  });
  const total = await prisma.user.count({
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

const getByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      user_id: id,
    },
    include: {
      cards: true,
      deposits: true,
      withdrawals: true,
      transactions: true,
      transfersReceived: true,
      transfersSent: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      user_id: id,
    },
    data: payload,
    include: {
      cards: true,
      deposits: true,
      withdrawals: true,
      transactions: true,
      transfersReceived: true,
      transfersSent: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      user_id: id,
    },
    include: {
      cards: true,
      deposits: true,
      withdrawals: true,
      transactions: true,
      transfersReceived: true,
      transfersSent: true,
    },
  });
  return result;
};

export const UserService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
