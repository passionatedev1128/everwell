import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrderById,
  uploadPaymentProof
} from '../controllers/orderController.js';
import { protect, requireAuthorization } from '../middleware/auth.js';
import { uploadPaymentProof as uploadPaymentProofMiddleware } from '../config/upload.js';

const router = express.Router();

// All order routes require authentication and authorization
router.use(protect);
router.use(requireAuthorization);

// Validation middleware
const createOrderValidation = [
  body('products').isArray({ min: 1 }).withMessage('Pelo menos um produto é obrigatório'),
  body('products.*.productId').notEmpty().withMessage('ID do produto é obrigatório'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser pelo menos 1'),
  body('products.*.price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('shippingAddress.street').notEmpty().withMessage('Rua é obrigatória'),
  body('shippingAddress.city').notEmpty().withMessage('Cidade é obrigatória'),
  body('shippingAddress.state').notEmpty().withMessage('Estado é obrigatório'),
  body('shippingAddress.zipCode').notEmpty().withMessage('CEP é obrigatório')
];

// Routes
router.post('/', createOrderValidation, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/payment', uploadPaymentProofMiddleware.single('file'), uploadPaymentProof);

export default router;

