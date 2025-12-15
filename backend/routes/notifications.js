import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead, createNotification, deleteNotification, getAllNotifications, sendToAllUsers, updateNotification, deleteNotificationAdmin } from '../controllers/notificationController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// User routes
router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/admin', requireAdmin, createNotification);
router.get('/admin/all', requireAdmin, getAllNotifications);
router.post('/admin/send-all', requireAdmin, sendToAllUsers);
router.patch('/admin/:id', requireAdmin, updateNotification);
router.delete('/admin/:id', requireAdmin, deleteNotificationAdmin);

export default router;

