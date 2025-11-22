import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);

export default router;
