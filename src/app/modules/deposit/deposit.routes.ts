import { Router } from 'express';
import { DepositController } from './deposit.controller';
import Auth from '../../middlewares/Auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/add-deposit',
  Auth(UserRole.CUSTOMER),
  DepositController.addDeposit
);

router.get('/', Auth(UserRole.CUSTOMER), DepositController.getAll);

export const DepositRoutes = router;
