import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { welcomeEmailTemplate } from '../utils/emailTemplates.js';

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Send welcome email for new users (async, don't wait)
    if (user.provider === 'google' && user.createdAt && (Date.now() - new Date(user.createdAt).getTime()) < 60000) {
      // User was just created (within last minute)
      const welcomeTemplate = welcomeEmailTemplate(user.name);
      sendEmail({
        to: user.email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
        text: welcomeTemplate.text
      }).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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

