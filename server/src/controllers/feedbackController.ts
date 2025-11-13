import { Request, Response } from 'express';
import { Feedback } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get all feedback (includes both GitHub issues and DB feedback)
 */
export const getFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { search, status, type } = req.query;

  // Build query
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (type && type !== 'all') {
    query.type = type;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const feedback = await Feedback.find(query)
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    data: feedback,
  });
});

/**
 * Create new feedback
 */
export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { title, description, type, rating, userEmail, userName } = req.body;

  if (!title || !description) {
    throw new AppError('Title and description are required', 400, 'VALIDATION_ERROR');
  }

  // For public submissions, require email and name
  if (!user && (!userEmail || !userName)) {
    throw new AppError('Email and name are required', 400, 'VALIDATION_ERROR');
  }

  if (rating && (rating < 1 || rating > 5)) {
    throw new AppError('Rating must be between 1 and 5', 400, 'VALIDATION_ERROR');
  }

  const feedback = await Feedback.create({
    userId: user?.id || null,
    organizationId: user?.organizationId || null,
    type: type || 'feedback',
    title,
    description,
    status: 'open',
    upvotes: 0,
    rating: rating || undefined,
    userEmail: user?.email || userEmail,
    userName: user?.displayName || user?.email || userName,
  });

  res.status(201).json({
    data: feedback,
    message: 'Feedback submitted successfully',
  });
});

/**
 * Update feedback status
 */
export const updateFeedbackStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['open', 'closed', 'in_progress'].includes(status)) {
    throw new AppError('Invalid status', 400, 'VALIDATION_ERROR');
  }

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!feedback) {
    throw new AppError('Feedback not found', 404, 'NOT_FOUND');
  }

  res.json({
    data: feedback,
    message: 'Feedback status updated',
  });
});

/**
 * Upvote feedback
 */
export const upvoteFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  if (!feedback) {
    throw new AppError('Feedback not found', 404, 'NOT_FOUND');
  }

  res.json({
    data: feedback,
  });
});

/**
 * Delete feedback
 */
export const deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const feedback = await Feedback.findByIdAndDelete(id);

  if (!feedback) {
    throw new AppError('Feedback not found', 404, 'NOT_FOUND');
  }

  res.json({
    message: 'Feedback deleted successfully',
  });
});
