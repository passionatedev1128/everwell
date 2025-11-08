import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, uploadDocument } from '../controllers/userController.js';
import { uploadDocument as uploadDocumentMiddleware } from '../config/upload.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.patch('/profile', updateProfile);
router.post('/documents/:documentType', uploadDocumentMiddleware.single('file'), uploadDocument);

export default router;

