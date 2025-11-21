import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as HabitModel from '../models/Habit';
import { successResponse, errorResponse } from '../utils/response';

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const habits = await HabitModel.getHabitsByUserId(req.user!.userId);
    return successResponse(res, habits);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch habits', 500, error);
  }
};

export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habitData = {
      ...req.body,
      user_id: req.user!.userId,
      current_streak: 0,
      longest_streak: 0,
    };

    const habit = await HabitModel.createHabit(habitData);
    return successResponse(res, habit, 'Habit created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create habit', 500, error);
  }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const habit = await HabitModel.updateHabit(id, req.user!.userId, req.body);
    return successResponse(res, habit, 'Habit updated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update habit', 500, error);
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await HabitModel.deleteHabit(id, req.user!.userId);
    return successResponse(res, null, 'Habit deleted');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete habit', 500, error);
  }
};

export const logHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const logData = {
      ...req.body,
      habit_id: id,
      completed: true,
    };

    const log = await HabitModel.createHabitLog(logData);
    return successResponse(res, log, 'Habit logged', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to log habit', 500, error);
  }
};

export const getHabitLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const logs = await HabitModel.getHabitLogs(id);
    return successResponse(res, logs);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch habit logs', 500, error);
  }
};
