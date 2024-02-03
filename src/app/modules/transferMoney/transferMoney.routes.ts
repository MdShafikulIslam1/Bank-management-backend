import { Router } from 'express';
import { TransferMoneyController } from './transferMoney.controller';

const router = Router();

router.post('/', TransferMoneyController.transferMoney);

export const TransferMoneyRoutes = router;
