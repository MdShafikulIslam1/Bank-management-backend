import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DepositService } from './deposit.service';

const addDeposit = catchAsync(async (req, res) => {
  const { user_id } = req.params;
  const amount = parseInt(req.body.amount);

  const result = await DepositService.addDeposit({ user_id, amount });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Deposit added successfully',
    data: result,
  });
});

export const DepositController = {
  addDeposit,
};
