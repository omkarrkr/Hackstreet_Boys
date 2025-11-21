import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as GoalModel from '../models/Goal';
import { successResponse, errorResponse } from '../utils/response';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await GoalModel.getGoalsByUserId(req.user!.userId);
    return successResponse(res, goals);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch goals', 500, error);
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goalData = {
      ...req.body,
      user_id: req.user!.userId,
      status: req.body.status || 'not_started',
      priority: req.body.priority || 'medium',
      progress_percentage: 0,
    };

    const goal = await GoalModel.createGoal(goalData);
    return successResponse(res, goal, 'Goal created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create goal', 500, error);
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await GoalModel.updateGoal(id, req.user!.userId, req.body);
    return successResponse(res, goal, 'Goal updated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update goal', 500, error);
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await GoalModel.deleteGoal(id, req.user!.userId);
    return successResponse(res, null, 'Goal deleted');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete goal', 500, error);
  }
};

export const createGoalStep = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const stepData = {
      ...req.body,
      goal_id: id,
      completed: false,
    };

    const step = await GoalModel.createGoalStep(stepData);
    return successResponse(res, step, 'Goal step created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create goal step', 500, error);
  }
};

export const getGoalSteps = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const steps = await GoalModel.getGoalSteps(id);
    return successResponse(res, steps);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch goal steps', 500, error);
  }
};

export const generateAIRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const { goalTitle, description, timeframe } = req.body;

    // Mock AI-generated roadmap
    const mockSteps = [
      {
        title: `Research and planning for ${goalTitle}`,
        description: 'Gather information and create a detailed plan',
        order_index: 1,
      },
      {
        title: 'Break down into smaller milestones',
        description: 'Divide the goal into achievable sub-goals',
        order_index: 2,
      },
      {
        title: 'Execute first milestone',
        description: 'Start working on the first actionable step',
        order_index: 3,
      },
      {
        title: 'Review and adjust',
        description: 'Evaluate progress and make necessary adjustments',
        order_index: 4,
      },
      {
        title: 'Complete and celebrate',
        description: 'Finish the goal and acknowledge your achievement',
        order_index: 5,
      },
    ];

    return successResponse(res, mockSteps, 'AI roadmap generated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to generate roadmap', 500, error);
  }
};
