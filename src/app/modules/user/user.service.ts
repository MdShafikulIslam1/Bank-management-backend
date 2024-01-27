import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

const createAccount = async (data: User) => {
  const { password } = data;

  const hashedPassword = await bcrypt.hash(password, 12);
};

export const UserService = {
  createAccount,
};
