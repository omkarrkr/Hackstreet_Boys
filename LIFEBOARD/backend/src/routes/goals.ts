import { Router } from 'express';
import * as goalsController from '../controllers/goalsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', goalsController.getGoals);
router.post('/', goalsController.createGoal);
router.put('/:id', goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);
router.post('/:id/steps', goalsController.createGoalStep);
router.get('/:id/steps', goalsController.getGoalSteps);
router.post('/ai-roadmap', goalsController.generateAIRoadmap);

export default router;
