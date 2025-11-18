import { Request, Response } from 'express';
import Organization from '../models/Organization';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get user's organization
 */
export const getOrganization = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    throw new AppError('User not authenticated', 401, 'AUTH_REQUIRED');
  }

  // Find organization owned by this user
  let organization = await Organization.findOne({ ownerId: userId });

  // If no organization exists, create a default one
  if (!organization) {
    organization = await Organization.create({
      name: req.user?.user?.displayName || req.user?.email || 'My Company',
      email: req.user?.email || '',
      ownerId: userId,
    });
  }

  res.json({
    success: true,
    message: 'Organization retrieved successfully',
    data: organization,
  });
});

/**
 * Update user's organization
 */
export const updateOrganization = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const updates = req.body;

  if (!userId) {
    throw new AppError('User not authenticated', 401, 'AUTH_REQUIRED');
  }

  // Find and update organization
  let organization = await Organization.findOneAndUpdate(
    { ownerId: userId },
    updates,
    { new: true, runValidators: true }
  );

  // If no organization exists, create one with the updates
  if (!organization) {
    organization = await Organization.create({
      ...updates,
      ownerId: userId,
    });
  }

  res.json({
    success: true,
    message: 'Organization updated successfully',
    data: organization,
  });
});
