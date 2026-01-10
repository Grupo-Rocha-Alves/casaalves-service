import { Router } from 'express';
import { 
  createExpense, 
  getExpenseById, 
  updateExpense, 
  deleteExpense, 
  listExpenses,
  exportExpensesToCSV
} from '../controller/expensesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/createExpense', authMiddleware(2), logMiddleware(logAction.create('despesa')), createExpense);
router.get('/getAllExpenses', authMiddleware(1), listExpenses);
router.get('/exportExpenses', authMiddleware(2), exportExpensesToCSV);
router.get('/getExpenseById/:id', authMiddleware(1), getExpenseById);
router.patch('/updateExpense/:id', authMiddleware(2), logMiddleware(logAction.update('despesa')), updateExpense);
router.delete('/deleteExpense/:id', authMiddleware(2), logMiddleware(logAction.delete('despesa')), deleteExpense);

export default router;
