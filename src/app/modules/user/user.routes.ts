import { Router } from 'express';
import { UserController } from './user.controller';
import Auth from '../../middlewares/Auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/create-account', UserController.createAccount);

router.post('/login', UserController.login);

router.post(
  '/change-password',
  Auth(UserRole.CUSTOMER, UserRole.CUSTOMER),
  UserController.changePassword
);

router.post('/forgot-password', UserController.forgotPassword);

router.post('/reset-password', UserController.resetPassword);

export const UserRouter = router;
