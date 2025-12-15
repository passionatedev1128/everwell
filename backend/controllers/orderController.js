import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import { getFileUrl } from '../config/upload.js';
import { sendEmail } from '../config/email.js';
import { orderStatusUpdateEmailTemplate } from '../utils/emailTemplates.js';
import { sendOrderToHubSpot } from '../integrations/hubspot.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Authorized users only)
export const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, paymentProof } = req.body;
    const userId = req.user._id;

    // Validate products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Produtos são obrigatórios'
      });
    }

    // Calculate total amount
    const totalAmount = products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Endereço de entrega completo é obrigatório'
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentProof: paymentProof ? {
        url: paymentProof.url,
        uploadedAt: new Date(),
        status: 'pending'
      } : undefined,
      status: 'pending'
    });

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'order_created',
      details: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        productCount: order.products.length
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Fire-and-forget HubSpot integration
    try {
      const user = await User.findById(userId).select('name email phone');
      if (user) {
        sendOrderToHubSpot(order, user).catch((err) => {
          console.error('❌ HubSpot integration error:', err?.message || err);
        });
      }
    } catch (hubspotError) {
      console.error('❌ HubSpot user lookup error:', hubspotError?.message || hubspotError);
    }

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private (Authorized users only)
export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // Build query
    const query = { userId };
    if (status) {
      query.status = status;
    }

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name slug images');

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Authorized users only or Admin)
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Build query
    const query = { _id: id };
    if (!isAdmin) {
      query.userId = userId; // Users can only see their own orders
    }

    const order = await Order.findOne(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'name slug images description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload payment proof
// @route   POST /api/orders/:id/payment
// @access  Private (Authorized users only)
export const uploadPaymentProof = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado.'
      });
    }

    // Find order
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Get file URL
    const fileUrl = getFileUrl(file.filename, 'payment');

    // Update payment proof
    order.paymentProof = {
      url: fileUrl,
      uploadedAt: new Date(),
      status: 'pending'
    };

    await order.save();

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'payment_proof_uploaded',
      details: {
        orderId: order._id
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Comprovante de pagamento enviado com sucesso',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, userId } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('products.productId', 'name slug images');

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido. Use: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Populate user for email
    await order.populate('userId', 'name email');

    // Create audit log
    await AuditLog.create({
      adminId: req.user._id,
      action: 'order_status_updated',
      details: {
        orderId: order._id,
        userId: order.userId._id,
        oldStatus,
        newStatus: status
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Send email notification to user
    if (order.userId && order.userId.email && oldStatus !== status) {
      const emailTemplate = orderStatusUpdateEmailTemplate(
        order.userId.name,
        order._id.toString(),
        oldStatus,
        status,
        {
          totalAmount: order.totalAmount
        }
      );
      sendEmail({
        to: order.userId.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      }).catch(err => {
        console.error('Failed to send order status update email:', err);
      });
    }

    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso',
      order
    });
  } catch (error) {
    next(error);
  }
};

