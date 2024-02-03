"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRoutes = void 0;
const express_1 = require("express");
const deposit_controller_1 = require("./deposit.controller");
const router = (0, express_1.Router)();
router.post('/add-deposit/:id', deposit_controller_1.DepositController.addDeposit);
exports.DepositRoutes = router;
