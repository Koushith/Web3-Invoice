import express, { Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', authenticate, requireRole('admin', 'superadmin'), async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })
      .select('-__v');

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page as string),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private/Admin
 */
router.get('/:id', authenticate, requireRole('admin', 'superadmin'), async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', authenticate, requireRole('admin', 'superadmin'), async (req: Request, res: Response) => {
  try {
    const { role, status, subscription } = req.body;

    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (subscription) updateData.subscription = subscription;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/users/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user?.uid }).select('-__v -passkeys');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/users/profile/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile/me', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      displayName,
      phone,
      language,
      jobTitle,
      department,
      bio,
      city,
      country,
      timezone,
      dateFormat,
      photoURL,
    } = req.body;

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (displayName !== undefined) updateData.displayName = displayName;
    if (phone !== undefined) updateData.phone = phone;
    if (language !== undefined) updateData.language = language;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (department !== undefined) updateData.department = department;
    if (bio !== undefined) updateData.bio = bio;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (dateFormat !== undefined) updateData.dateFormat = dateFormat;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user?.uid },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v -passkeys');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
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

export default router;
