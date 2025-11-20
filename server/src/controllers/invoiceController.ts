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
  const totalPages = Math.ceil(total / Number(limit));

  res.json({
    data: invoices,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
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

  res.json({ data: invoice });
});

/**
 * Get next available invoice number
 */
export const getNextInvoiceNumber = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Get organization to get the prefix
  const organization = await Organization.findById(user.organizationId);
  const prefix = organization?.invoicePrefix || 'INV';

  // Find all invoices for this organization to get the highest number
  const allInvoices = await Invoice.find({
    organizationId: user.organizationId,
  }).select('invoiceNumber');

  let nextNumber = '001';

  if (allInvoices.length > 0) {
    // Extract all numbers and find the maximum
    const invoiceNumbers = allInvoices
      .map((inv) => {
        const match = inv.invoiceNumber?.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));

    if (invoiceNumbers.length > 0) {
      const maxNumber = Math.max(...invoiceNumbers);
      nextNumber = String(maxNumber + 1).padStart(4, '0');
    }
  }

  res.json({
    data: {
      prefix,
      number: nextNumber,
      fullNumber: `${prefix}-${nextNumber}`,
    },
  });
});

/**
 * Create invoice
 */
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const {
    customerId,
    invoiceNumber: providedInvoiceNumber,
    issueDate,
    dueDate,
    currency,
    lineItems,
    taxRate,
    notes,
    terms,
    allowedPaymentMethods,
    status,
    templateStyle,
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

  // Determine invoice number - use provided or generate new one
  let invoiceNumber: string;

  if (providedInvoiceNumber) {
    // Use provided invoice number, but check for duplicates
    const existingInvoice = await Invoice.findOne({
      organizationId: user.organizationId,
      invoiceNumber: providedInvoiceNumber,
    });

    if (existingInvoice) {
      throw new AppError(
        `Invoice number ${providedInvoiceNumber} already exists. Please use a different number.`,
        409,
        'DUPLICATE_INVOICE_NUMBER'
      );
    }

    invoiceNumber = providedInvoiceNumber;
  } else {
    // Auto-generate invoice number
    // Check if customer has custom invoice settings
    if (customer.invoiceSettings?.prefix && customer.invoiceSettings?.nextNumber) {
      // Use customer-specific invoice numbering
      invoiceNumber = `${customer.invoiceSettings.prefix}-${String(customer.invoiceSettings.nextNumber).padStart(3, '0')}`;

      // Increment customer's next invoice number
      customer.invoiceSettings.nextNumber += 1;
      await customer.save();
    } else {
      // Use organization-level invoice numbering
      invoiceNumber = `${organization.invoicePrefix}-${String(organization.invoiceNumberSequence).padStart(4, '0')}`;

      // Increment organization sequence
      organization.invoiceNumberSequence += 1;
      await organization.save();
    }
  }

  // Calculate line item amounts
  const processedLineItems = lineItems.map((item: any) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));

  // Create invoice (stored only in MongoDB - no blockchain gas fees!)
  const invoice = await Invoice.create({
    organizationId: user.organizationId,
    customerId,
    invoiceNumber,
    status: status || 'sent', // Use provided status or default to 'sent'
    issueDate: issueDate || new Date(),
    dueDate,
    currency: currency || organization.currency,
    lineItems: processedLineItems,
    taxRate: taxRate || organization.settings.defaultTaxRate || 0,
    notes,
    terms,
    allowedPaymentMethods: allowedPaymentMethods || ['bank_transfer'],
    createdBy: user._id,
    templateStyle,
    subtotal: 0, // Will be calculated by pre-save hook
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,
  });

  res.status(201).json({
    message: 'Invoice created successfully',
    data: invoice,
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
    data: invoice,
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
    data: invoice,
  });
});

/**
 * Manually mark invoice as paid
 * Fallback when automatic payment detection fails
 */
export const markInvoiceAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;
  const {
    amountPaid,
    paymentMethod,
    transactionReference,
    paymentDate,
    notes
  } = req.body;

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

  if (invoice.status === 'paid') {
    throw new AppError('Invoice is already marked as paid', 400, 'ALREADY_PAID');
  }

  // Update payment details
  const paymentAmount = amountPaid || invoice.total;
  invoice.amountPaid += paymentAmount;
  invoice.amountDue = invoice.total - invoice.amountPaid;

  // Update status based on payment
  if (invoice.amountDue <= 0) {
    invoice.status = 'paid';
    invoice.paidAt = paymentDate ? new Date(paymentDate) : new Date();
  } else {
    invoice.status = 'partial';
  }

  // Add payment note to invoice
  if (notes || transactionReference) {
    const paymentNote = `Manual payment recorded by ${user.displayName || user.email}
Amount: ${paymentAmount} ${invoice.currency}
Method: ${paymentMethod || 'Not specified'}
${transactionReference ? `Reference: ${transactionReference}` : ''}
${notes ? `Notes: ${notes}` : ''}
Date: ${new Date().toISOString()}`;

    invoice.notes = invoice.notes
      ? `${invoice.notes}\n\n---\n${paymentNote}`
      : paymentNote;
  }

  await invoice.save();

  // Create Payment record for transactions page
  const Payment = (await import('../models/Payment')).default;

  // Map payment method to expected enum values
  const normalizedPaymentMethod = paymentMethod?.toLowerCase() || 'bank_transfer';
  const paymentMethodEnum = ['stripe', 'crypto', 'bank_transfer', 'cash', 'check'].includes(normalizedPaymentMethod)
    ? normalizedPaymentMethod
    : 'bank_transfer';

  const payment = await Payment.create({
    organizationId: user.organizationId,
    invoiceId: invoice._id,
    customerId: invoice.customerId,
    amount: paymentAmount,
    currency: invoice.currency,
    paymentMethod: paymentMethodEnum,
    status: 'completed',
    transactionId: transactionReference || `MANUAL-${Date.now()}`,
    notes: notes || `Manual payment recorded by ${user.displayName || user.email}`,
    processedAt: paymentDate ? new Date(paymentDate) : new Date(),
    metadata: {
      recordedBy: user.email,
      recordedByName: user.displayName,
      recordedAt: new Date().toISOString(),
      manual: true,
    }
  });

  res.json({
    message: 'Invoice marked as paid successfully',
    data: invoice,
    payment: payment,
  });
});

/**
 * Send invoice to customer (generates link and updates status)
 */
export const sendInvoice = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const invoice = await Invoice.findOne({
    _id: id,
    organizationId: user.organizationId,
  })
    .populate('customerId', 'name email company')
    .populate('organizationId', 'name email');

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Ensure invoice has a publicId
  if (!invoice.publicId) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let publicId = '';
    for (let i = 0; i < 12; i++) {
      publicId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    invoice.publicId = publicId;
  }

  // Update invoice status to 'sent'
  if (invoice.status === 'draft') {
    invoice.status = 'sent';
  }

  invoice.sentAt = new Date();
  await invoice.save();

  // Generate public URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const publicUrl = `${frontendUrl}/invoice/${invoice.publicId}`;

  // Send email to customer
  let emailSent = false;
  let emailError = null;

  try {
    const { sendInvoiceEmail } = await import('../services/emailService');
    const customer = invoice.customerId as any;
    const organization = invoice.organizationId as any;

    if (customer?.email) {
      const dueDate = invoice.dueDate
        ? new Date(invoice.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined;

      await sendInvoiceEmail({
        to: customer.email,
        invoiceNumber: invoice.invoiceNumber,
        invoiceAmount: invoice.total.toFixed(2),
        currency: invoice.currency,
        dueDate,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email,
        customerCompany: customer.company,
        companyName: organization?.name || 'Your Company',
        companyEmail: organization?.email,
        companyPhone: organization?.phone,
        invoiceUrl: publicUrl,
      });

      emailSent = true;
    } else {
      emailError = 'Customer email not found';
    }
  } catch (error: any) {
    console.error('Failed to send invoice email:', error);
    emailError = error.message;
  }

  res.json({
    message: emailSent
      ? 'Invoice sent successfully via email'
      : 'Invoice marked as sent, but email could not be delivered',
    data: {
      invoice,
      publicUrl,
      emailSent,
      emailError,
    },
  });
});

/**
 * Get invoice by public ID (no authentication required)
 */
export const getPublicInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new AppError('Public ID is required', 400, 'INVALID_REQUEST');
  }

  const invoice = await Invoice.findOne({ publicId })
    .populate('customerId', 'name email company address phone')
    .populate('organizationId', 'name email phone address logo website')
    .lean();

  if (!invoice) {
    throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
  }

  // Update viewedAt timestamp if first time viewing
  if (!invoice.viewedAt) {
    await Invoice.findOneAndUpdate(
      { publicId },
      { viewedAt: new Date(), status: invoice.status === 'sent' ? 'viewed' : invoice.status }
    );
  }

  res.json({
    data: invoice,
  });
});
