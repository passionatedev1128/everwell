import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  link: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);

