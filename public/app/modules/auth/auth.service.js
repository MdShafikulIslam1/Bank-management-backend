"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpes_1 = require("../../../helpers/jwtHelpes");
const config_1 = __importDefault(require("../../../config"));
const sendEmail_1 = require("./sendEmail");
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
    });
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, password } = payload;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            user_name,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcrypt_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { id, email, role } = isUserExist;
    const accessToken = jwtHelpes_1.JwtHelpers.createToken({ id, email, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return accessToken;
});
const changePassword = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: user_id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old password
    if (isUserExist.password &&
        !(yield bcrypt_1.default.compare(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password is incorrect');
    }
    yield prisma_1.default.user.update({
        where: {
            id: user_id,
        },
        data: {
            password: yield bcrypt_1.default.hash(newPassword, 12),
        },
    });
    return 'successfully changed password';
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const resetPasswordToken = jwtHelpes_1.JwtHelpers.resetPasswordToken({ email });
    const resetLink = config_1.default.resetLink + `email=${email}&token=${resetPasswordToken}`;
    yield (0, sendEmail_1.SendEmail)(email, `
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
    `);
    return 'Please check your email for the reset password link.';
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const isVerified = jwtHelpes_1.JwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    if (!isVerified) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token is invalid');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return 'Your password has been reset successfully';
});
exports.AuthService = {
    createAccount,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
};
