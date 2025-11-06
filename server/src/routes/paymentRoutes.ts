import { Router } from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  getInvoicePayments,
} from '../controllers/paymentController';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.get('/invoice/:invoiceId', getInvoicePayments);

export default router;
