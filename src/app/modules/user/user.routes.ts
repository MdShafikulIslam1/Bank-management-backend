import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.post('/create-account', UserController.createAccount);

export const UserRouter = router;
