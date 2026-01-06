import { Router } from 'express';
import { 
  createExpense, 
  getExpenseById, 
  updateExpense, 
  deleteExpense, 
  listExpenses 
} from '../controller/expensesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/createExpense', authMiddleware(), logMiddleware(logAction.create('despesa')), createExpense);
router.get('/getAllExpenses', authMiddleware(), listExpenses);
router.get('/getExpenseById/:id', authMiddleware(), getExpenseById);
router.patch('/updateExpense/:id', authMiddleware(), logMiddleware(logAction.update('despesa')), updateExpense);
router.delete('/deleteExpense/:id', authMiddleware(), logMiddleware(logAction.delete('despesa')), deleteExpense);

export default router;
