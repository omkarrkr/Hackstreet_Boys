import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const createAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiry,
  });
};

export const createRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiry,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as TokenPayload;
};
