import express from 'express';
import { createFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, getMyFeedbacks, getResolvedFeedbacks } from '../controllers/feedbackController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createFeedback);
router.get('/resolved', getResolvedFeedbacks); // Public route for homepage testimonials

// Protected routes - require authentication
router.get('/me', protect, getMyFeedbacks); // Get current user's feedbacks

// Admin routes - require authentication and admin role
router.use(protect);
router.use(requireAdmin);

router.get('/', getAllFeedback);
router.patch('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;

