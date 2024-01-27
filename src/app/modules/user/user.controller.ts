import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createAccount = catchAsync(async (req, res) => {
  const user = await UserService.createAccount(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Account created successfully',
    data: user,
  });
});

const login = catchAsync(async (req, res) => {
  const token = await UserService.login(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Login successful',
    data: token,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user_id = req.user?.user_id;
  const { ...passwordData } = req.body;
  await UserService.changePassword(user_id, passwordData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully!',
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await UserService.forgotPassword(req?.body?.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || '';
  const result = await UserService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result,
  });
});

export const UserController = {
  createAccount,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
