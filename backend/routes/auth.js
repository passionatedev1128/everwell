import express from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { 
  register, 
  completeRegistration,
  login, 
  getMe, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { googleCallback } from '../controllers/oauthController.js';
import { protect } from '../middleware/auth.js';
import { registerGoogleStrategy } from '../config/passport.js';

const router = express.Router();

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages
    });
  }
  next();
};

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
  
  // Try to register the strategy if it's not already registered
  if (!passport._strategies || !passport._strategies.google) {
    const registered = registerGoogleStrategy();
    if (!registered) {
      return res.status(503).json({
        success: false,
        message: 'Google OAuth strategy não pôde ser registrado. Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configurados corretamente no .env e reinicie o servidor.'
      });
    }
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  (req, res, next) => {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_not_configured`);
    }
    
    // Try to register the strategy if it's not already registered
    if (!passport._strategies || !passport._strategies.google) {
      const registered = registerGoogleStrategy();
      if (!registered) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_strategy_not_registered`);
      }
    }
    
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed` })(req, res, next);
  },
  googleCallback
);

// Regular Auth Routes
// Registration (email and password only)
const initialRegisterValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido. Use um endereço de email válido de qualquer provedor (Gmail, Outlook, Yahoo, etc.)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
];

router.post('/register', initialRegisterValidation, handleValidationErrors, register);
// Step 2: Complete registration after email verification
router.post('/complete-registration/:token', [
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], completeRegistration);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', protect, resendVerification);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

export default router;

