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
exports.DepositService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addDeposit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = payload;
    // Find the user and related deposits
    const isExistUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user_id,
        },
        select: {
            id: true,
            account_balance: true,
        },
    });
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Calculate the new total_amount by adding the amount to the existing total_amount
    const newTotalAmount = isExistUser.account_balance + amount;
    // Create a new deposit record
    const deposit = yield prisma_1.default.$transaction((ts) => __awaiter(void 0, void 0, void 0, function* () {
        yield ts.user.update({
            where: {
                id: isExistUser.id,
            },
            data: {
                account_balance: newTotalAmount,
            },
        });
        yield ts.transaction.create({
            data: {
                amount,
                user_id: isExistUser.id,
                transaction_type: 'DEPOSIT',
            },
        });
        const result = yield ts.deposit.create({
            data: {
                amount,
                user_id: isExistUser.id,
                total_amount: newTotalAmount,
            },
            include: {
                user: true,
            },
        });
        yield ts.withdrawal.updateMany({
            where: {
                user_id: isExistUser.id,
            },
            data: {
                rest_amount: newTotalAmount,
            },
        });
        return result;
    }));
    return deposit;
});
exports.DepositService = {
    addDeposit,
};
