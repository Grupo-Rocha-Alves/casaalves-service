import { Router } from 'express';
import { 
  createInvoice, 
  getInvoiceById, 
  updateInvoice, 
  deleteInvoice, 
  listInvoices,
  exportInvoicesToCSV
} from '../controller/invoicesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/createInvoice', authMiddleware(2), logMiddleware(logAction.create('invoice')), createInvoice);
router.get('/getAllInvoices', authMiddleware(1), listInvoices);
router.get('/exportInvoices', authMiddleware(2), exportInvoicesToCSV);
router.get('/getInvoiceById/:id', authMiddleware(1), getInvoiceById);
router.patch('/updateInvoice/:id', authMiddleware(2), logMiddleware(logAction.update('invoice')), updateInvoice);
router.delete('/deleteInvoice/:id', authMiddleware(2), logMiddleware(logAction.delete('invoice')), deleteInvoice);

export default router;
