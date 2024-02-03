import { Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { DepositRoutes } from '../modules/deposit/deposit.routes';
import { WithdrawRoutes } from '../modules/withdraw/withdraw.routes';
import { TransferMoneyRoutes } from '../modules/transferMoney/transferMoney.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/deposit',
    route: DepositRoutes,
  },
  {
    path: '/withdraw',
    route: WithdrawRoutes,
  },
  {
    path: '/transfer-money',
    route: TransferMoneyRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
