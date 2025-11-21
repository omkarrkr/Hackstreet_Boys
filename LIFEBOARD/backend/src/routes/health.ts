import { Router } from 'express';
import * as healthController from '../controllers/healthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/metrics', healthController.getHealthMetrics);
router.post('/metrics', healthController.createHealthMetric);
router.get('/workouts', healthController.getWorkouts);
router.post('/workouts', healthController.createWorkout);

export default router;
