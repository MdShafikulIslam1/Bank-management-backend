import { Router } from 'express';
import { WithdrawController } from './withdraw.controller';

const router = Router();

router.post('/add-withdraw/:id', WithdrawController.addWithdraw);

export const WithdrawRoutes = router;
