import express, { Request, Response } from 'express';
import { authenticate, verifyFirebaseToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: req.user?.user,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const { displayName, organizationId } = req.body;
    const mongoUser = req.user?.user;

    if (!mongoUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateData: any = {};
    if (displayName) updateData.displayName = displayName;
    if (organizationId) updateData.organizationId = organizationId;

    const updatedUser = await User.findByIdAndUpdate(
      mongoUser._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/sync
 * @desc    Sync user data from Firebase to MongoDB (creates user if doesn't exist)
 * @access  Private
 */
router.post('/sync', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const { displayName, photoURL, organization } = req.body;
    const firebaseUid = req.user?.uid;
    const email = req.user?.email;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authentication data',
      });
    }

    // Find or create user
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        firebaseUid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || undefined,
        role: 'owner', // Default role for new users
        isActive: true,
      });
      console.log(`[Auth] New user created: ${email}`);
    } else {
      // Update existing user
      const updateData: any = {};
      if (displayName && displayName !== user.displayName) {
        updateData.displayName = displayName;
      }
      if (photoURL && photoURL !== user.photoURL) {
        updateData.photoURL = photoURL;
      }
      if (organization) {
        updateData.organizationId = organization;
      }

      if (Object.keys(updateData).length > 0) {
        user = await User.findByIdAndUpdate(
          user._id,
          { $set: updateData },
          { new: true }
        );
      }
      console.log(`[Auth] User synced: ${email}`);
    }

    res.json({
      success: true,
      message: 'User data synced successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('[Auth] Sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user data',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/auth/me
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const mongoUser = req.user?.user;

    if (!mongoUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - mark as inactive
    await User.findByIdAndUpdate(mongoUser._id, { isActive: false });

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message,
    });
  }
});

export default router;
