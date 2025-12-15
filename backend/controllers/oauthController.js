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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Send verification email for new users
    let emailSent = true;
    if (user.provider === 'google' && user.createdAt && (Date.now() - new Date(user.createdAt).getTime()) < 60000) {
      // User was just created (within last minute) - send verification email
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationTokenExpires = emailVerificationTokenExpires;
      await user.save();

      const verificationTemplate = emailVerificationTemplate(user.name, emailVerificationToken, false);
      try {
        const emailResult = await sendEmail({
          to: user.email,
          subject: verificationTemplate.subject,
          html: verificationTemplate.html,
          text: verificationTemplate.text
        });
        emailSent = emailResult && emailResult.success;
        if (emailSent) {
          console.log(`✅ Verification email sent to ${user.email}`);
        } else {
          console.error(`❌ Failed to send verification email to ${user.email}:`, emailResult?.message || emailResult?.error);
        }
      } catch (err) {
        console.error('❌ Error sending verification email:', err);
        emailSent = false;
      }
    }

    // Redirect to frontend with token and email status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (!emailSent) {
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true&emailError=true`);
    } else {
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
    }
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

