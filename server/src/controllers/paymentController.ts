import { Request, Response } from 'express';
import { Payment, Invoice, Customer } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get all payments for organization
 */
export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { invoiceId, customerId, status, page = 1, limit = 10 } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Build query
  const query: any = {
    organizationId: user.organizationId,
  };

  if (invoiceId) query.invoiceId = invoiceId;
  if (customerId) query.customerId = customerId;
  if (status) query.status = status;

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const payments = await Payment.find(query)
    .populate('invoiceId', 'invoiceNumber total')
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Payment.countDocuments(query);

  res.json({
    payments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Get single payment
 */
export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const payment = await Payment.findOne({
    _id: id,
    organizationId: user.organizationId,
  })
    .populate('invoiceId')
    .populate('customerId');

  if (!payment) {
    throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
  }

  res.json({ payment });
});

/**
 * Record a manual payment (cash, check, bank transfer)
 */
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const {
    invoiceId,
    amount,
    paymentMethod,
    transactionId,
    notes,
  } = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  if (!invoiceId || !amount || !paymentMethod) {
    throw new AppError('Invoice, amount, and payment method are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Get invoice
  const invoice = await Invoice.findOne({
    _id: invoiceId,
    organizationId: user.organizationId,
  });

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Validate payment amount
  if (amount <= 0) {
    throw new AppError('Payment amount must be greater than 0', 400, 'INVALID_AMOUNT');
  }

  if (amount > invoice.amountDue) {
    throw new AppError('Payment amount exceeds amount due', 400, 'AMOUNT_EXCEEDS_DUE');
  }

  // Create payment record
  const payment = await Payment.create({
    organizationId: user.organizationId,
    invoiceId,
    customerId: invoice.customerId,
    amount,
    currency: invoice.currency,
    paymentMethod,
    paymentReference: {},
    status: 'completed',
    transactionId,
    notes,
    processedAt: new Date(),
  });

  // Update invoice
  invoice.amountPaid += amount;
  invoice.amountDue -= amount;

  if (invoice.amountDue <= 0) {
    invoice.status = 'paid';
    invoice.paidAt = new Date();
  } else {
    invoice.status = 'partial';
  }

  await invoice.save();

  // Update customer totals
  await Customer.findByIdAndUpdate(invoice.customerId, {
    $inc: { totalPaid: amount },
  });

  res.status(201).json({
    message: 'Payment recorded successfully',
    payment,
    invoice: {
      id: invoice._id,
      amountPaid: invoice.amountPaid,
      amountDue: invoice.amountDue,
      status: invoice.status,
    },
  });
});

/**
 * Get payments for a specific invoice
 */
export const getInvoicePayments = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { invoiceId } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Verify invoice belongs to organization
  const invoice = await Invoice.findOne({
    _id: invoiceId,
    organizationId: user.organizationId,
  });

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  const payments = await Payment.find({
    invoiceId,
    organizationId: user.organizationId,
  }).sort({ createdAt: -1 });

  res.json({
    invoice: {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      amountDue: invoice.amountDue,
      status: invoice.status,
    },
    payments,
  });
});
