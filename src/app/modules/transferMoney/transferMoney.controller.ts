import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TransferMoneyService } from './transferMoney.service';

const transferMoney = catchAsync(async (req, res) => {
  const { amount: amountMoney, sender_id, receiver_id } = req.body;
  const amount = parseInt(amountMoney);
  const result = await TransferMoneyService.transferMoney({
    amount,
    sender_id,
    receiver_id,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Transfer money success',
    success: true,
    data: result,
  });
});

export const TransferMoneyController = {
  transferMoney,
};
