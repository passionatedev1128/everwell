import express from 'express';
import { getAllUsers, toggleUserAuthorization, updateDocumentStatus, getAuditLogs, deleteUser } from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.patch('/users/documents/status', updateDocumentStatus);
router.patch('/users/:id/authorize', toggleUserAuthorization);
router.delete('/users/:id', deleteUser);
router.get('/auditlogs', getAuditLogs);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

