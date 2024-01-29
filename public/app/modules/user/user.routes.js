"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/create-account', user_controller_1.UserController.createAccount);
router.post('/login', user_controller_1.UserController.login);
router.post('/change-password', (0, Auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.CUSTOMER), user_controller_1.UserController.changePassword);
router.post('/forgot-password', user_controller_1.UserController.forgotPassword);
router.post('/reset-password', user_controller_1.UserController.resetPassword);
exports.UserRouter = router;
