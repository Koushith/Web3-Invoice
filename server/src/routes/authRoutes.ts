import { Router } from 'express';
import {
  register,
  getProfile,
  updateProfile,
  createOrganization,
} from '../controllers/authController';
import { authenticate, verifyFirebaseToken } from '../middleware';

const router = Router();

// Public routes (only Firebase token verification)
router.post('/register', verifyFirebaseToken, register);

// Protected routes (require both Firebase token and MongoDB user)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/organization', authenticate, createOrganization);

export default router;
