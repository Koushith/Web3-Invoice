import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
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
      data: req.user,
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
    const { displayName, organization, preferences } = req.body;

    const updateData: any = {};
    if (displayName) updateData.displayName = displayName;
    if (organization) updateData.organization = organization;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
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
 * @desc    Sync user data from Firebase to MongoDB
 * @access  Private
 */
router.post('/sync', authenticate, async (req: Request, res: Response) => {
  try {
    const { organization } = req.body;

    // Update user with additional data
    if (organization) {
      req.user.organization = organization;
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'User data synced successfully',
      data: req.user,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
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
    // Soft delete - mark as deleted
    req.user.status = 'deleted';
    await req.user.save();

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
