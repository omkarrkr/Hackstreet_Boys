import { Router } from 'express';
import * as financesController from '../controllers/financesController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/transactions', financesController.getTransactions);
router.post('/transactions', financesController.createTransaction);
router.put('/transactions/:id', financesController.updateTransaction);
router.delete('/transactions/:id', financesController.deleteTransaction);
router.get('/summary', financesController.getSummary);
router.get('/budget', financesController.getBudgets);
router.post('/budget', financesController.createBudget);

export default router;
