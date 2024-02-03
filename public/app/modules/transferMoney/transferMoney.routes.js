"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMoneyRoutes = void 0;
const express_1 = require("express");
const transferMoney_controller_1 = require("./transferMoney.controller");
const router = (0, express_1.Router)();
router.post('/', transferMoney_controller_1.TransferMoneyController.transferMoney);
exports.TransferMoneyRoutes = router;
