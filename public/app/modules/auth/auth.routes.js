"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/create-account', auth_controller_1.AuthController.createAccount);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/change-password', (0, Auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.CUSTOMER), auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
exports.AuthRouter = router;
