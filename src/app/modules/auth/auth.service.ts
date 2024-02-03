import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import { IChangePassword, ILogIn } from './auth.interface';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { JwtHelpers } from '../../../helpers/jwtHelpes';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { SendEmail } from './sendEmail';

const createAccount = async (data: User): Promise<User | null> => {
  const { password } = data;

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return result;
};

const login = async (payload: ILogIn): Promise<string> => {
  const { user_name, password } = payload;

  const isUserExist = await prisma.user.findFirst({
    where: {
      user_name,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { id, email, role } = isUserExist;

  const accessToken = JwtHelpers.createToken(
    { id, email, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return accessToken;
};

const changePassword = async (
  user_id: string,
  payload: IChangePassword
): Promise<string> => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await bcrypt.compare(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      password: await bcrypt.hash(newPassword, 12),
    },
  });

  return 'successfully changed password';
};

const forgotPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const resetPasswordToken = JwtHelpers.resetPasswordToken({ email });
  const resetLink: string =
    config.resetLink + `email=${email}&token=${resetPasswordToken}`;

  await SendEmail(
    email,
    `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
          a {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #aa5eb3;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease-in-out;
          }
          a:hover {
            background-color: #0056b9;
            color: #fff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hi ${isUserExist.user_name}</h1>
          <p>Please click on the below link to reset your password.</p>
          <a href="${resetLink}">Reset Password</a>
        </div>
      </body>
      </html>
    `
  );

  return 'Please check your email for the reset password link.';
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const { email, newPassword } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  const isVerified = JwtHelpers.verifyToken(token, config.jwt.secret as Secret);

  if (!isVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token is invalid');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return 'Your password has been reset successfully';
};

export const AuthService = {
  createAccount,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
