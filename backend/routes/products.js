import express from 'express';
import { getAllProducts, getProductById, getProductBySlug } from '../controllers/productController.js';
import { protect, requireAuthorization } from '../middleware/auth.js';

const router = express.Router();

// All product routes require authentication and authorization
router.get('/', protect, requireAuthorization, getAllProducts);
router.get('/:id', protect, requireAuthorization, getProductById);
router.get('/slug/:slug', protect, requireAuthorization, getProductBySlug);

export default router;

