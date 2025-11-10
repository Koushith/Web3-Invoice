import { Router } from 'express';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  markInvoiceAsPaid,
} from '../controllers/invoiceController';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.post('/:id/mark-paid', markInvoiceAsPaid); // Manual payment marking

export default router;
