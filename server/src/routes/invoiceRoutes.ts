import { Router } from 'express';
import {
  getInvoices,
  getInvoice,
  getNextInvoiceNumber,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  markInvoiceAsPaid,
  getPublicInvoice,
  sendInvoice,
} from '../controllers/invoiceController';
import { authenticate } from '../middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/public/:publicId', getPublicInvoice);

// All other routes require authentication
router.use(authenticate);

router.get('/', getInvoices);
router.get('/next-number', getNextInvoiceNumber);  // Must be before /:id route
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.post('/:id/mark-paid', markInvoiceAsPaid); // Manual payment marking
router.post('/:id/send', sendInvoice); // Send invoice to customer

export default router;
