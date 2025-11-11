import { Router } from 'express';
import {
  getOrganization,
  updateOrganization,
} from '../controllers/organizationController';
import { authenticate } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getOrganization);
router.put('/', updateOrganization);

export default router;
