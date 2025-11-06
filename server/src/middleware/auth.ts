import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase';
import { User } from '../models';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        user?: any; // MongoDB user document
      };
    }
  }
}

/**
 * Middleware to verify Firebase ID token
 */
export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'No authorization token provided',
          code: 'AUTH_TOKEN_MISSING',
        },
      });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase token
    const decodedToken = await getFirebaseAuth().verifyIdToken(idToken);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error: any) {
    console.error('Firebase token verification failed:', error);

    res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: 'AUTH_TOKEN_INVALID',
      },
    });
  }
};

/**
 * Middleware to load MongoDB user data
 */
export const loadUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({
        error: {
          message: 'User not authenticated',
          code: 'USER_NOT_AUTHENTICATED',
        },
      });
      return;
    }

    // Find user in MongoDB
    const user = await User.findOne({ firebaseUid: req.user.uid }).populate('organizationId');

    if (!user) {
      res.status(404).json({
        error: {
          message: 'User not found in database',
          code: 'USER_NOT_FOUND',
        },
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        error: {
          message: 'User account is deactivated',
          code: 'USER_DEACTIVATED',
        },
      });
      return;
    }

    // Attach full user data to request
    req.user.user = user;

    next();
  } catch (error: any) {
    console.error('Error loading user data:', error);
    res.status(500).json({
      error: {
        message: 'Failed to load user data',
        code: 'USER_LOAD_ERROR',
      },
    });
  }
};

/**
 * Middleware to check user role permissions
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredRoles: allowedRoles,
        },
      });
      return;
    }

    next();
  };
};

/**
 * Combined authentication middleware (verify token + load user)
 */
export const authenticate = [verifyFirebaseToken, loadUserData];
