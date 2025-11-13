import rateLimit from 'express-rate-limit';

/**
 * General rate limiter - 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for feedback GET - 50 requests per 15 minutes
 */
export const feedbackGetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Very strict rate limiter for feedback POST - 5 submissions per 15 minutes
 */
export const feedbackPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'You have submitted too much feedback. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

/**
 * Upvote rate limiter - 20 upvotes per 15 minutes
 */
export const feedbackUpvoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many upvotes, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
