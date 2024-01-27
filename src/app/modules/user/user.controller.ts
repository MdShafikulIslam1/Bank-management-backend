import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user.service';

const createAccount = catchAsync(async (req, res, next) => {
  console.log('request', req.body);
  const result = await UserService.createAccount();
});

export const UserController = {
  createAccount,
};
