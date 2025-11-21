import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as BucketItemModel from '../models/BucketItem';
import { successResponse, errorResponse } from '../utils/response';

export const getBucketItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await BucketItemModel.getBucketItemsByUserId(req.user!.userId);
    return successResponse(res, items);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch bucket list items', 500, error);
  }
};

export const createBucketItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemData = {
      ...req.body,
      user_id: req.user!.userId,
      status: req.body.status || 'not_started',
    };

    const item = await BucketItemModel.createBucketItem(itemData);
    return successResponse(res, item, 'Bucket list item created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create bucket list item', 500, error);
  }
};

export const updateBucketItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await BucketItemModel.updateBucketItem(id, req.user!.userId, req.body);
    return successResponse(res, item, 'Bucket list item updated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update bucket list item', 500, error);
  }
};

export const deleteBucketItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await BucketItemModel.deleteBucketItem(id, req.user!.userId);
    return successResponse(res, null, 'Bucket list item deleted');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete bucket list item', 500, error);
  }
};
