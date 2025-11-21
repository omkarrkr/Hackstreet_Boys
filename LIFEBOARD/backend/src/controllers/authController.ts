import { Request, Response } from 'express';
import { createUser, findUserByEmail, findUserById } from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwords';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'User already exists', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, fullName);

    const accessToken = createAccessToken({ userId: user.id, email: user.email });
    const refreshToken = createRefreshToken({ userId: user.id, email: user.email });

    const { password_hash, ...userWithoutPassword } = user;

    return successResponse(res, {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }, 'User registered successfully', 201);
  } catch (error: any) {
    return errorResponse(res, 'Registration failed', 500, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const accessToken = createAccessToken({ userId: user.id, email: user.email });
    const refreshToken = createRefreshToken({ userId: user.id, email: user.email });

    const { password_hash, ...userWithoutPassword } = user;

    return successResponse(res, {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }, 'Login successful');
  } catch (error: any) {
    return errorResponse(res, 'Login failed', 500, error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = createAccessToken({ userId: decoded.userId, email: decoded.email });

    return successResponse(res, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (error: any) {
    return errorResponse(res, 'Invalid refresh token', 401, error);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const { password_hash, ...userWithoutPassword } = user;
    return successResponse(res, userWithoutPassword);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch user', 500, error);
  }
};
