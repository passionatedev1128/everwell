import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { welcomeEmailTemplate, emailVerificationTemplate } from '../utils/emailTemplates.js';

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // TEMPORARILY: Auto-verify and auto-login all users (bypass email verification)
    // Ensure user is verified and authorized
    if (!user.emailVerified) {
      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpires = null;
      await user.save();
    }
    
    if (!user.isAuthorized) {
      user.isAuthorized = true;
      await user.save();
    }

    // Auto-login (both new and existing users)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
  } catch (error) {
    next(error);
  }
};

// @desc    Get OAuth user info (for frontend)
// @route   GET /api/auth/oauth/user
// @access  Private
export const getOAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

