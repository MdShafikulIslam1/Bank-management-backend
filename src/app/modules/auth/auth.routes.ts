import { Router } from 'express';
import { AuthController } from './auth.controller';
import Auth from '../../middlewares/Auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/create-account', AuthController.createAccount);

router.post('/login', AuthController.login);

router.post(
  '/change-password',
  Auth(UserRole.CUSTOMER, UserRole.CUSTOMER),
  AuthController.changePassword
);

router.post('/forgot-password', AuthController.forgotPassword);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRouter = router;
