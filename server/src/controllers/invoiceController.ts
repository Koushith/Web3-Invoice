import { Request, Response } from 'express';
import { Invoice, Organization, Customer } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get all invoices for organization
 */
export const getInvoices = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { status, customerId, search, page = 1, limit = 10 } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Build query
  const query: any = {
    organizationId: user.organizationId,
  };

  if (status) {
    query.status = status;
  }

  if (customerId) {
    query.customerId = customerId;
  }

  if (search) {
    query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const invoices = await Invoice.find(query)
    .populate('customerId', 'name email company')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Invoice.countDocuments(query);

  res.json({
    invoices,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Get single invoice
 */
export const getInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const invoice = await Invoice.findOne({
    _id: id,
    organizationId: user.organizationId,
  })
    .populate('customerId')
    .populate('createdBy', 'displayName email');

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  res.json({ invoice });
});

/**
 * Create invoice
 */
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const {
    customerId,
    issueDate,
    dueDate,
    currency,
    lineItems,
    taxRate,
    notes,
    terms,
    allowedPaymentMethods,
  } = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  if (!customerId || !lineItems || lineItems.length === 0) {
    throw new AppError('Customer and line items are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Verify customer belongs to organization
  const customer = await Customer.findOne({
    _id: customerId,
    organizationId: user.organizationId,
  });

  if (!customer) {
    throw new AppError('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
  }

  // Get organization to generate invoice number
  const organization = await Organization.findById(user.organizationId);
  if (!organization) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Generate invoice number
  const invoiceNumber = `${organization.invoicePrefix}-${String(organization.invoiceNumberSequence).padStart(4, '0')}`;

  // Increment sequence
  organization.invoiceNumberSequence += 1;
  await organization.save();

  // Calculate line item amounts
  const processedLineItems = lineItems.map((item: any) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));

  // Create invoice
  const invoice = await Invoice.create({
    organizationId: user.organizationId,
    customerId,
    invoiceNumber,
    issueDate: issueDate || new Date(),
    dueDate,
    currency: currency || organization.currency,
    lineItems: processedLineItems,
    taxRate: taxRate || organization.settings.defaultTaxRate || 0,
    notes,
    terms,
    allowedPaymentMethods: allowedPaymentMethods || ['stripe'],
    createdBy: user._id,
    subtotal: 0, // Will be calculated by pre-save hook
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,
  });

  res.status(201).json({
    message: 'Invoice created successfully',
    invoice,
  });
});

/**
 * Update invoice
 */
export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;
  const updates = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Find invoice
  const invoice = await Invoice.findOne({
    _id: id,
    organizationId: user.organizationId,
  });

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Can't edit paid invoices
  if (invoice.status === 'paid' && updates.status !== 'paid') {
    throw new AppError('Cannot edit a paid invoice', 400, 'INVOICE_PAID');
  }

  // Process line items if updated
  if (updates.lineItems) {
    updates.lineItems = updates.lineItems.map((item: any) => ({
      ...item,
      amount: item.quantity * item.unitPrice,
    }));
  }

  // Update invoice
  Object.assign(invoice, updates);
  await invoice.save();

  res.json({
    message: 'Invoice updated successfully',
    invoice,
  });
});

/**
 * Delete invoice (soft delete or cancel)
 */
export const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const invoice = await Invoice.findOne({
    _id: id,
    organizationId: user.organizationId,
  });

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Can't delete paid invoices
  if (invoice.status === 'paid') {
    throw new AppError('Cannot delete a paid invoice', 400, 'INVOICE_PAID');
  }

  invoice.status = 'cancelled';
  await invoice.save();

  res.json({
    message: 'Invoice cancelled successfully',
  });
});

/**
 * Update invoice status
 */
export const updateInvoiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;
  const { status } = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  if (!status) {
    throw new AppError('Status is required', 400, 'MISSING_STATUS');
  }

  const invoice = await Invoice.findOne({
    _id: id,
    organizationId: user.organizationId,
  });

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Update status and related timestamps
  invoice.status = status;

  if (status === 'sent' && !invoice.sentAt) {
    invoice.sentAt = new Date();
  }

  if (status === 'viewed' && !invoice.viewedAt) {
    invoice.viewedAt = new Date();
  }

  await invoice.save();

  res.json({
    message: 'Invoice status updated successfully',
    invoice,
  });
});
