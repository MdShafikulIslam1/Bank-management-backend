import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DepositService } from './deposit.service';
import pick from '../../../shared/pick';
import { depositFilterableFields } from './deposit.constant';
import { paginationOptionFields } from '../../../common/paginationOptions';

const addDeposit = catchAsync(async (req, res) => {
  const amount = parseInt(req.body.amount);
  const user_id = req?.user?.id;

  const result = await DepositService.addDeposit({ user_id, amount });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Deposit added successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const filters = pick(req.query, depositFilterableFields);
  const options = pick(req.query, paginationOptionFields);
  const result = await DepositService.getAll(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Deposit fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const DepositController = {
  addDeposit,
  getAll,
};
