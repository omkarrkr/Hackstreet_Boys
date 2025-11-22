import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as UserModel from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwords';
import { successResponse, errorResponse } from '../utils/response';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, email } = req.body;
    const userId = req.user!.userId;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    const updatedUser = await UserModel.updateUser(userId, { full_name, email });
    const { password_hash, ...userWithoutPassword } = updatedUser;

    return successResponse(res, userWithoutPassword, 'Profile updated successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update profile', 500, error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user!.userId;

    if (!current_password || !new_password) {
      return errorResponse(res, 'Current password and new password are required', 400);
    }

    // Get user with password
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(current_password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(new_password);

    // Update password
    await UserModel.updateUser(userId, { password_hash: newPasswordHash });

    return successResponse(res, null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to change password', 500, error);
  }
};
