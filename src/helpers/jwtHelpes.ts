import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

const createToken = (
  payload: Record<string, unknown>,
  secretKey: Secret,
  expiresTime: string
): string => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresTime });
};

const resetPasswordToken = (payload: { email: string }) => {
  return jwt.sign(payload, config.jwt.secret as Secret, {
    algorithm: 'HS256',
    expiresIn: '30m',
  });
};

const verifyToken = (token: string, secretKey: Secret): JwtPayload => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
export const JwtHelpers = {
  createToken,
  verifyToken,
  resetPasswordToken,
};
