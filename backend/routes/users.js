import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, uploadDocument, uploadUserPhoto } from '../controllers/userController.js';
import { uploadDocument as uploadDocumentMiddleware, uploadUserPhoto as uploadUserPhotoMiddleware } from '../config/upload.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.patch('/profile', updateProfile);
router.post('/documents/:documentType', uploadDocumentMiddleware.single('file'), uploadDocument);
router.post('/photo', uploadUserPhotoMiddleware.single('photo'), uploadUserPhoto);

export default router;

