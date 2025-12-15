import express from 'express';
import { getAllBlogs, getBlogBySlug, getAllBlogsAdmin, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes - require authentication and admin role
router.use(protect);
router.use(requireAdmin);
router.get('/admin/all', getAllBlogsAdmin);
router.get('/admin/:id', getBlogById);
router.post('/admin', createBlog);
router.patch('/admin/:id', updateBlog);
router.delete('/admin/:id', deleteBlog);

export default router;

