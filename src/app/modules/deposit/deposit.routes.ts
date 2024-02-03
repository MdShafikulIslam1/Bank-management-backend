import { Router } from 'express';
import { DepositController } from './deposit.controller';

const router = Router();

router.post('/add-deposit/:id', DepositController.addDeposit);

export const DepositRoutes = router;
