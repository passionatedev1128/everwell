import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { 
  welcomeEmailTemplate, 
  emailVerificationTemplate,
  passwordResetTemplate 
} from '../utils/emailTemplates.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso.'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      isAuthorized: false,
      emailVerified: false,
      emailVerificationToken,
      emailVerificationTokenExpires
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Send verification email (async, don't wait for it)
    const verificationTemplate = emailVerificationTemplate(user.name, emailVerificationToken);
    sendEmail({
      to: user.email,
      subject: verificationTemplate.subject,
      html: verificationTemplate.html,
      text: verificationTemplate.text
    }).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    // Also send welcome email
    const welcomeTemplate = welcomeEmailTemplate(user.name);
    sendEmail({
      to: user.email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html,
      text: welcomeTemplate.text
    }).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Registro realizado com sucesso. Verifique seu email para ativar sua conta.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAuthorized: user.isAuthorized,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAuthorized: user.isAuthorized
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
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

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificação inválido ou expirado.'
      });
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Email verificado com sucesso!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email já está verificado.'
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    await user.save();

    // Send verification email
    const verificationTemplate = emailVerificationTemplate(user.name, emailVerificationToken);
    sendEmail({
      to: user.email,
      subject: verificationTemplate.subject,
      html: verificationTemplate.html,
      text: verificationTemplate.text
    }).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.json({
      success: true,
      message: 'Email de verificação reenviado. Verifique sua caixa de entrada.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return res.json({
        success: true,
        message: 'Se o email existir, você receberá um link para redefinir sua senha.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = resetTokenExpires;
    await user.save();

    // Send password reset email
    const resetTemplate = passwordResetTemplate(user.name, resetToken);
    sendEmail({
      to: user.email,
      subject: resetTemplate.subject,
      html: resetTemplate.html,
      text: resetTemplate.text
    }).catch(err => {
      console.error('Failed to send password reset email:', err);
    });

    res.json({
      success: true,
      message: 'Se o email existir, você receberá um link para redefinir sua senha.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres.'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de redefinição inválido ou expirado.'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso!'
    });
  } catch (error) {
    next(error);
  }
};

