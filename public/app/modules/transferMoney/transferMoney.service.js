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
exports.TransferMoneyService = void 0;
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const transferMoney = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, sender_id, receiver_id } = payload;
    if (!sender_id || !receiver_id) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'amount and sender_id and receiver must be provided');
    }
    const isExistSender = yield prisma_1.default.user.findFirst({
        where: {
            id: sender_id,
        },
    });
    const isExistReceiver = yield prisma_1.default.user.findFirst({
        where: {
            id: receiver_id,
        },
    });
    if (!isExistSender || !isExistReceiver) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'sender_id and receiver_id not found');
    }
    if (amount < 100) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'amount must be greater than 100');
    }
    if (amount > isExistSender.account_balance) {
        throw new ApiError_1.default(http_status_1.default.INSUFFICIENT_STORAGE, `you don't have enough funds. Your current balance is = ${isExistSender.account_balance} tk`);
    }
    const lastTransfer = yield prisma_1.default.transfer.findFirst({
        where: {
            sender_id,
            created_at: {
                gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            },
        },
    });
    if (lastTransfer) {
        throw new ApiError_1.default(http_status_1.default.TOO_MANY_REQUESTS, 'You cannot transfer money more than once within 5 minutes.');
    }
    const transferMoney = yield prisma_1.default.$transaction((ts) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE TRANSACTION FOR SENDER
        yield ts.transaction.create({
            data: {
                amount,
                user_id: isExistSender.id,
                transaction_type: client_1.TransactionType.TRANSFER,
            },
        });
        // UPDATE SENDER ACCOUNT BALANCE
        yield ts.user.update({
            where: {
                id: sender_id,
            },
            data: {
                account_balance: isExistSender.account_balance - amount,
            },
        });
        // CREATE TRANSACTION FOR RECEIVER
        yield ts.transaction.create({
            data: {
                amount,
                user_id: isExistReceiver.id,
                transaction_type: client_1.TransactionType.TRANSFER,
            },
        });
        // UPDATE RECEIVER ACCOUNT BALANCE
        yield ts.user.update({
            where: {
                id: receiver_id,
            },
            data: {
                account_balance: isExistReceiver.account_balance + amount,
            },
        });
        // CREATE TRANSFER RECORD
        const moneyTransfer = yield ts.transfer.create({
            data: {
                amount,
                sender_id,
                receiver_id,
            },
            include: {
                sender: true,
                receiver: true,
            },
        });
        return moneyTransfer;
    }));
    return transferMoney;
});
exports.TransferMoneyService = {
    transferMoney,
};
