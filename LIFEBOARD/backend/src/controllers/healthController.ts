import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as HealthModel from '../models/HealthMetric';
import { successResponse, errorResponse } from '../utils/response';

export const getHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const metrics = await HealthModel.getHealthMetricsByUserId(req.user!.userId);
    return successResponse(res, metrics);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch health metrics', 500, error);
  }
};

export const createHealthMetric = async (req: AuthRequest, res: Response) => {
  try {
    const metricData = {
      ...req.body,
      user_id: req.user!.userId,
    };

    const metric = await HealthModel.createHealthMetric(metricData);
    return successResponse(res, metric, 'Health metric created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create health metric', 500, error);
  }
};

export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await HealthModel.getWorkoutsByUserId(req.user!.userId);
    return successResponse(res, workouts);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch workouts', 500, error);
  }
};

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workoutData = {
      ...req.body,
      user_id: req.user!.userId,
    };

    const workout = await HealthModel.createWorkout(workoutData);
    return successResponse(res, workout, 'Workout created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create workout', 500, error);
  }
};
