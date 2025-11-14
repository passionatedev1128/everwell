import User from '../models/User.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import { sendEmail } from '../config/email.js';
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
