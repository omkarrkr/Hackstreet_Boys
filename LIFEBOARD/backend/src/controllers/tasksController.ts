import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as TaskModel from '../models/Task';
import { successResponse, errorResponse } from '../utils/response';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await TaskModel.getTasksByUserId(req.user!.userId);
    return successResponse(res, tasks);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch tasks', 500, error);
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskData = {
      ...req.body,
      user_id: req.user!.userId,
      status: req.body.status || 'todo',
      priority: req.body.priority || 'medium',
    };

    const task = await TaskModel.createTask(taskData);
    return successResponse(res, task, 'Task created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create task', 500, error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.updateTask(id, req.user!.userId, req.body);
    return successResponse(res, task, 'Task updated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update task', 500, error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await TaskModel.deleteTask(id, req.user!.userId);
    return successResponse(res, null, 'Task deleted');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete task', 500, error);
  }
};
