import { Router } from 'express';
import * as goalsController from '../controllers/goalsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', goalsController.getGoals);
router.post('/', goalsController.createGoal);
router.put('/:id', goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);

router.get('/:id/steps', goalsController.getGoalSteps);
router.post('/:id/steps', goalsController.createGoalStep);
router.put('/:id/steps/:stepId', goalsController.updateGoalStep);
router.delete('/:id/steps/:stepId', goalsController.deleteGoalStep);

router.post('/ai-roadmap', goalsController.generateAIRoadmap);

export default router;
