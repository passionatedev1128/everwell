import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user_authorized', 
      'user_deauthorized', 
      'user_deleted',
      'product_viewed',
      'product_created',
      'product_updated',
      'product_deleted',
      'admin_login',
      'order_created',
      'payment_proof_uploaded',
      'order_status_updated',
      'password_updated'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

export default mongoose.model('AuditLog', AuditLogSchema);

