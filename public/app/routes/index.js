"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const deposit_routes_1 = require("../modules/deposit/deposit.routes");
const withdraw_routes_1 = require("../modules/withdraw/withdraw.routes");
const transferMoney_routes_1 = require("../modules/transferMoney/transferMoney.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRouter,
    },
    {
        path: '/users',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/deposit',
        route: deposit_routes_1.DepositRoutes,
    },
    {
        path: '/withdraw',
        route: withdraw_routes_1.WithdrawRoutes,
    },
    {
        path: '/transfer-money',
        route: transferMoney_routes_1.TransferMoneyRoutes,
    },
];
moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
