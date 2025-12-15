import express from 'express';
import { getAllProducts, getProductById, getProductBySlug } from '../controllers/productController.js';

const router = express.Router();

// Product routes are now public - no authentication required
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

export default router;

