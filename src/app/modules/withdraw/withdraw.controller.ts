import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawService } from './withdraw.service';
import pick from '../../../shared/pick';
import { depositFilterableFields } from '../deposit/deposit.constant';
import { paginationOptionFields } from '../../../common/paginationOptions';

const addWithdraw = catchAsync(async (req, res) => {
  const user_id = req?.user?.id;
  const amount = parseInt(req.body.amount);

  const result = await WithdrawService.addWithdraw({ user_id, amount });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Withdraw has been successful',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const filters = pick(req.query, depositFilterableFields);
  const options = pick(req.query, paginationOptionFields);
  const result = await WithdrawService.getAll(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All withdraw fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const WithdrawController = {
  addWithdraw,
  getAll,
};
