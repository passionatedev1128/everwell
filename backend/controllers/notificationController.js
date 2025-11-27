import Notification from '../models/Notification.js';

// Get all notifications for a user
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { read, limit = 50 } = req.query;

    const query = { userId };
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, userId });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada.'
      });
    }

    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notificação marcada como lida.',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, read: false },
      { 
        $set: { 
          read: true, 
          readAt: new Date() 
        } 
      }
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas.'
    });
  } catch (error) {
    next(error);
  }
};

// Create notification (admin only)
export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, link } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Usuário, título e mensagem são obrigatórios.'
      });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'info',
      link: link || null
    });

    res.status(201).json({
      success: true,
      message: 'Notificação criada com sucesso.',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada.'
      });
    }

    res.json({
      success: true,
      message: 'Notificação deletada com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

// Get all notifications (admin only)
export const getAllNotifications = async (req, res, next) => {
  try {
    const { userId, read, limit = 100 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (read !== undefined) query.read = read === 'true';

    const notifications = await Notification.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// Send notification to all users (admin only)
export const sendToAllUsers = async (req, res, next) => {
  try {
    const { title, message, type, link } = req.body;
    const User = (await import('../models/User.js')).default;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Título e mensagem são obrigatórios.'
      });
    }

    // Get all users
    const users = await User.find({}).select('_id');
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum usuário encontrado.'
      });
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'info',
      link: link || null
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Notificação enviada para ${users.length} usuário(s).`,
      count: users.length
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification (admin - can delete any)
export const deleteNotificationAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada.'
      });
    }

    res.json({
      success: true,
      message: 'Notificação deletada com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

