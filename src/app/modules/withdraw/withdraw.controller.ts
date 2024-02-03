import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawService } from './withdraw.service';

const addWithdraw = catchAsync(async (req, res) => {
  const { user_id } = req.params;
  const amount = parseInt(req.body.amount);

  const result = await WithdrawService.addWithdraw({ user_id, amount });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Withdraw has been successful',
    data: result,
  });
});

export const WithdrawController = {
  addWithdraw,
};
