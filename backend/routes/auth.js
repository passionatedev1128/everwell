import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { 
  register, 
  login, 
  getMe, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { googleCallback } from '../controllers/oauthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
// Note: Accepts emails from ANY provider (Gmail, Outlook, Yahoo, custom domains, etc.)
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido. Use um endereço de email válido de qualquer provedor (Gmail, Outlook, Yahoo, etc.)'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido. Use um endereço de email válido de qualquer provedor.'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Password reset validation
const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido.')
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.')
];

// OAuth Routes
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth não está configurado. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed` }),
  googleCallback
);

// Regular Auth Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', protect, resendVerification);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

export default router;

