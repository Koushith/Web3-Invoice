import { Router } from 'express';
import {
  getFeedback,
  createFeedback,
  updateFeedbackStatus,
  upvoteFeedback,
  deleteFeedback,
} from '../controllers/feedbackController';
import { authenticate, feedbackGetLimiter, feedbackPostLimiter, feedbackUpvoteLimiter } from '../middleware';

const router = Router();

// Public routes with rate limiting
router.get('/', feedbackGetLimiter, getFeedback);
router.post('/', feedbackPostLimiter, createFeedback);

// Protected routes
router.post('/:id/upvote', feedbackUpvoteLimiter, authenticate, upvoteFeedback);

// Protected routes (admin only)
router.patch('/:id/status', authenticate, updateFeedbackStatus);
router.delete('/:id', authenticate, deleteFeedback);

export default router;
