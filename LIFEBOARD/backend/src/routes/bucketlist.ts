import { Router } from 'express';
import * as bucketlistController from '../controllers/bucketlistController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/summary', bucketlistController.getBucketListSummary);
router.get('/', bucketlistController.getBucketItems);
router.post('/', bucketlistController.createBucketItem);
router.put('/:id', bucketlistController.updateBucketItem);
router.patch('/:id/status', bucketlistController.updateBucketItemStatus);
router.delete('/:id', bucketlistController.deleteBucketItem);

export default router;
