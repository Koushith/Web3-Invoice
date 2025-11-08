import { Request, Response } from 'express';
import { Customer } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get all customers for organization
 */
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { search, page = 1, limit = 10 } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Build query
  const query: any = {
    organizationId: user.organizationId,
    isActive: true,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const customers = await Customer.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Customer.countDocuments(query);

  res.json({
    data: customers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Get single customer
 */
export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const customer = await Customer.findOne({
    _id: id,
    organizationId: user.organizationId,
  });

  if (!customer) {
    throw new AppError('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
  }

  res.json({ data: customer });
});

/**
 * Create customer
 */
export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { name, email, phone, company, address, taxId, notes, tags, preferredPaymentMethod, walletAddress } = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  if (!name || !email) {
    throw new AppError('Customer name and email are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  const customer = await Customer.create({
    organizationId: user.organizationId,
    name,
    email,
    phone,
    company,
    address,
    taxId,
    notes,
    tags,
    preferredPaymentMethod,
    walletAddress,
  });

  res.status(201).json({
    message: 'Customer created successfully',
    customer,
  });
});

/**
 * Update customer
 */
export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;
  const { name, email, phone, company, address, taxId, notes, tags, preferredPaymentMethod, walletAddress } = req.body;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const customer = await Customer.findOneAndUpdate(
    { _id: id, organizationId: user.organizationId },
    { name, email, phone, company, address, taxId, notes, tags, preferredPaymentMethod, walletAddress },
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new AppError('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
  }

  res.json({
    message: 'Customer updated successfully',
    customer,
  });
});

/**
 * Delete customer (soft delete)
 */
export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { id } = req.params;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const customer = await Customer.findOneAndUpdate(
    { _id: id, organizationId: user.organizationId },
    { isActive: false },
    { new: true }
  );

  if (!customer) {
    throw new AppError('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
  }

  res.json({
    message: 'Customer deleted successfully',
  });
});
