import { Router } from 'express';
import { WithdrawController } from './withdraw.controller';
import Auth from '../../middlewares/Auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/add-withdraw',
  Auth(UserRole.CUSTOMER),
  WithdrawController.addWithdraw
);

router.get('/', Auth(UserRole.CUSTOMER), WithdrawController.getAll);

export const WithdrawRoutes = router;
