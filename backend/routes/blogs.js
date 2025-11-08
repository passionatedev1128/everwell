import express from 'express';
import { getAllBlogs, getBlogBySlug } from '../controllers/blogController.js';

const router = express.Router();

// Blog routes are public
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

export default router;

