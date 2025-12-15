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

    // Check if this is a new user (just created)
    const isNewUser = user.provider === 'google' && user.createdAt && (Date.now() - new Date(user.createdAt).getTime()) < 60000;

    if (isNewUser) {
      // New user: Don't auto-login, send verification email instead
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      user.emailVerified = false; // Set to false so they must verify
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
        
        if (emailResult && emailResult.success) {
          console.log(`✅ Verification email sent to ${user.email}`);
          // Redirect to message page telling user to check email
          res.redirect(`${frontendUrl}/login?message=verify_email&email=${encodeURIComponent(user.email)}`);
        } else {
          console.error(`❌ Failed to send verification email to ${user.email}:`, emailResult?.message || emailResult?.error);
          res.redirect(`${frontendUrl}/login?error=email_send_failed`);
        }
      } catch (err) {
        console.error('❌ Error sending verification email:', err);
        res.redirect(`${frontendUrl}/login?error=email_send_failed`);
      }
    } else {
      // Existing user: Auto-login
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

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

