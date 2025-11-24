import express from 'express';
import { createFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit feedback
router.post('/', createFeedback);

// Admin routes - require authentication and admin role
router.use(protect);
router.use(requireAdmin);

router.get('/', getAllFeedback);
router.patch('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;

