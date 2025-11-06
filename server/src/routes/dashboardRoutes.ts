import { Router } from 'express';
import {
  getDashboardStats,
  getRevenueData,
  getActivityFeed,
} from '../controllers/dashboardController';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueData);
router.get('/activity', getActivityFeed);

export default router;
