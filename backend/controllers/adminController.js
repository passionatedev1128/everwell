import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';
import { sendEmail } from '../config/email.js';
import { getFileUrl } from '../config/upload.js';
import { 
  authorizationEmailTemplate,
  documentApprovedEmailTemplate 
} from '../utils/emailTemplates.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Toggle authorization
    user.isAuthorized = !user.isAuthorized;
    await user.save();

    // Create audit log
    await AuditLog.create({
      action: user.isAuthorized ? 'user_authorized' : 'user_deauthorized',
      userId: user._id,
      adminId: req.user._id,
      details: {
        previousStatus: !user.isAuthorized,
        newStatus: user.isAuthorized
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Send authorization email notification
    const emailTemplate = authorizationEmailTemplate(user.name, user.isAuthorized);
    sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }).catch(err => {
      console.error('Failed to send authorization email:', err);
    });

    res.json({
      success: true,
      message: `Usuário ${user.isAuthorized ? 'autorizado' : 'desautorizado'} com sucesso.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAuthorized: user.isAuthorized
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const { userId, documentType, status } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    const validDocumentTypes = ['medicalPrescription', 'importAuthorization', 'proofOfResidence'];
    
    if (!validStatuses.includes(status) || !validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Status ou tipo de documento inválido.'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    if (!user.documents[documentType]?.url) {
      return res.status(400).json({
        success: false,
        message: 'Documento não encontrado.'
      });
    }

    // Update document status
    user.documents[documentType].status = status;
    await user.save();

    // Send email notification if approved
    if (status === 'approved') {
      const emailTemplate = documentApprovedEmailTemplate(user.name, documentType);
      sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      }).catch(err => {
        console.error('Failed to send document approval email:', err);
      });
    }

    res.json({
      success: true,
      message: `Status do documento atualizado para ${status}.`,
      document: user.documents[documentType]
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode deletar sua própria conta.'
      });
    }

    // Count user's orders before deletion
    const orderCount = await Order.countDocuments({ userId: user._id });

    // Delete all orders associated with this user
    await Order.deleteMany({ userId: user._id });

    // Create audit log before deletion
    await AuditLog.create({
      action: 'user_deleted',
      userId: user._id,
      adminId: req.user._id,
      details: {
        deletedUserName: user.name,
        deletedUserEmail: user.email,
        ordersDeleted: orderCount
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Delete the user
    await User.findByIdAndDelete(id);

    // Note: User's session will be invalidated on next request since the user no longer exists
    // The frontend should handle this by checking user existence on API calls

    res.json({
      success: true,
      message: `Usuário ${user.name} deletado com sucesso. ${orderCount} pedido(s) associado(s) também foram removidos.`,
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      ordersDeleted: orderCount
    });
  } catch (error) {
    next(error);
  }
};

// Product CRUD functions
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, subtitle, price, images, restrictions, visible, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Nome, descrição, preço e categoria são obrigatórios.'
      });
    }

    // Validate category
    const validCategories = ['gummy', 'oleo', 'creme'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoria inválida. Use: gummy, oleo ou creme.'
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um produto com este nome. Use um nome diferente.'
      });
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pelo menos uma imagem é obrigatória.'
      });
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      subtitle: subtitle || '',
      price: parseFloat(price),
      images,
      restrictions: restrictions || 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
      visible: visible !== undefined ? visible : true,
      category,
      productUrl: req.body.productUrl || 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
    });

    // Create audit log
    await AuditLog.create({
      action: 'product_created',
      adminId: req.user._id,
      details: {
        productId: product._id,
        productName: product.name,
        productSlug: product.slug
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso.',
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um produto com este slug.'
      });
    }
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, subtitle, price, images, restrictions, visible, category, productUrl } = req.body;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    // Update fields
    if (name !== undefined) {
      product.name = name;
      // Regenerate slug if name changed
      const newSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug conflicts with another product
      const existingProduct = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Já existe outro produto com este nome. Use um nome diferente.'
        });
      }
      product.slug = newSlug;
    }

    if (description !== undefined) product.description = description;
    if (subtitle !== undefined) product.subtitle = subtitle;
    if (price !== undefined) product.price = parseFloat(price);
    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Pelo menos uma imagem é obrigatória.'
        });
      }
      product.images = images;
    }
    if (restrictions !== undefined) product.restrictions = restrictions;
    if (visible !== undefined) product.visible = visible;
    if (category !== undefined) {
      const validCategories = ['gummy', 'oleo', 'creme'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Categoria inválida. Use: gummy, oleo ou creme.'
        });
      }
      product.category = category;
    }
    if (productUrl !== undefined) product.productUrl = productUrl;

    await product.save();

    // Create audit log
    await AuditLog.create({
      action: 'product_updated',
      adminId: req.user._id,
      details: {
        productId: product._id,
        productName: product.name
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso.',
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um produto com este slug.'
      });
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    // Check if product is used in any orders
    const orderCount = await Order.countDocuments({
      'products.productId': id
    });

    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível deletar este produto. Ele está associado a ${orderCount} pedido(s). Considere ocultá-lo em vez de deletá-lo.`
      });
    }

    // Create audit log before deletion
    await AuditLog.create({
      action: 'product_deleted',
      adminId: req.user._id,
      details: {
        productId: product._id,
        productName: product.name,
        productSlug: product.slug
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Produto ${product.name} deletado com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImages = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem foi enviada.'
      });
    }

    // Generate URLs for uploaded images
    const imageUrls = files.map(file => getFileUrl(file.filename, 'product'));

    res.json({
      success: true,
      message: `${files.length} imagem(ns) enviada(s) com sucesso.`,
      images: imageUrls
    });
  } catch (error) {
    next(error);
  }
};
