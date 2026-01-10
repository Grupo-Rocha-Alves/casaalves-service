import { Router } from 'express';
import { 
  createSale, 
  getSaleById, 
  updateSale, 
  deleteSale, 
  listSales,
  exportSalesToCSV
} from '../controller/salesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/createSale', authMiddleware(2), logMiddleware(logAction.create('venda')), createSale);
router.get('/getAllSales', authMiddleware(1), listSales);
router.get('/exportSales', authMiddleware(2), exportSalesToCSV);
router.get('/getSaleById/:id', authMiddleware(1), getSaleById);
router.patch('/updateSale/:id', authMiddleware(2), logMiddleware(logAction.update('venda')), updateSale);
router.delete('/deleteSale/:id', authMiddleware(2), logMiddleware(logAction.delete('venda')), deleteSale);
export default router;
