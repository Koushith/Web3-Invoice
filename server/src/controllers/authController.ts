import { Request, Response } from 'express';
import { User, Organization } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Register a new user (called after Firebase authentication)
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firebaseUid, email, displayName, photoURL } = req.body;

  if (!firebaseUid || !email) {
    throw new AppError('Firebase UID and email are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Check if user already exists
  let user = await User.findOne({ firebaseUid });

  if (user) {
    return res.status(200).json({
      message: 'User already registered',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        organizationId: user.organizationId,
        role: user.role,
      },
    });
  }

  // Create new user
  user = await User.create({
    firebaseUid,
    email,
    displayName,
    photoURL,
    role: 'owner',
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      organizationId: user.organizationId,
      role: user.role,
    },
  });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const populatedUser = await User.findById(user._id).populate('organizationId');

  res.json({
    user: {
      id: populatedUser?._id,
      email: populatedUser?.email,
      displayName: populatedUser?.displayName,
      photoURL: populatedUser?.photoURL,
      organizationId: populatedUser?.organizationId,
      role: populatedUser?.role,
      isActive: populatedUser?.isActive,
      createdAt: populatedUser?.createdAt,
    },
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { displayName, photoURL } = req.body;

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { displayName, photoURL },
    { new: true, runValidators: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser?._id,
      email: updatedUser?.email,
      displayName: updatedUser?.displayName,
      photoURL: updatedUser?.photoURL,
    },
  });
});

/**
 * Create organization for user
 */
export const createOrganization = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { name, email, phone, address, currency, invoicePrefix } = req.body;

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!name || !email) {
    throw new AppError('Organization name and email are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Check if user already has an organization
  if (user.organizationId) {
    throw new AppError('User already has an organization', 400, 'ORG_ALREADY_EXISTS');
  }

  // Create organization
  const organization = await Organization.create({
    name,
    email,
    phone,
    address,
    currency: currency || 'USD',
    invoicePrefix: invoicePrefix || 'INV',
    ownerId: user._id,
  });

  // Update user with organization ID
  await User.findByIdAndUpdate(user._id, { organizationId: organization._id });

  res.status(201).json({
    message: 'Organization created successfully',
    organization: {
      id: organization._id,
      name: organization.name,
      email: organization.email,
      currency: organization.currency,
      invoicePrefix: organization.invoicePrefix,
    },
  });
});
