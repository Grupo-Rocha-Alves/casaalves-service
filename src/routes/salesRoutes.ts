import { Router } from 'express';
import { 
  createSale, 
  getSaleById, 
  updateSale, 
  deleteSale, 
  listSales 
} from '../controller/salesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/createSale', authMiddleware(), logMiddleware(logAction.create('venda')), createSale);
router.get('/getAllSales', authMiddleware(), listSales);
router.get('/getSaleById/:id', authMiddleware(), getSaleById);
router.patch('/updateSale/:id', authMiddleware(), logMiddleware(logAction.update('venda')), updateSale);
router.delete('/deleteSale/:id', authMiddleware(), logMiddleware(logAction.delete('venda')), deleteSale);

export default router;
