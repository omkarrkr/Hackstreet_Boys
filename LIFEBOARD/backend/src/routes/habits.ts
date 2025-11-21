import { Router } from 'express';
import * as habitsController from '../controllers/habitsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', habitsController.getHabits);
router.post('/', habitsController.createHabit);
router.put('/:id', habitsController.updateHabit);
router.delete('/:id', habitsController.deleteHabit);
router.post('/:id/log', habitsController.logHabit);
router.get('/:id/logs', habitsController.getHabitLogs);

export default router;
