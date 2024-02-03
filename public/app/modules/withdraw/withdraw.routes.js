"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRoutes = void 0;
const express_1 = require("express");
const withdraw_controller_1 = require("./withdraw.controller");
const router = (0, express_1.Router)();
router.post('/add-withdraw/:id', withdraw_controller_1.WithdrawController.addWithdraw);
exports.WithdrawRoutes = router;
