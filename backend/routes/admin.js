import express from 'express';
import { getAllUsers, getUserById, toggleUserAuthorization, updateDocumentStatus, getAuditLogs, deleteUser, updateUserPassword, getAllProductsAdmin, createProduct, updateProduct, deleteProduct, uploadProductImages } from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { uploadProductImage } from '../config/upload.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/documents/status', updateDocumentStatus);
router.patch('/users/:id/authorize', toggleUserAuthorization);
router.patch('/users/:userId/password', updateUserPassword);
router.delete('/users/:id', deleteUser);
router.get('/auditlogs', getAuditLogs);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/products', getAllProductsAdmin);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/upload-images', uploadProductImage.array('images', 10), uploadProductImages);

export default router;

