import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous feedback
  },
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: [true, 'Avaliação é obrigatória'],
    min: 1,
    max: 5
  },
  message: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'archived'],
    default: 'pending'
  },
  response: {
    type: String,
    default: null
  },
  respondedAt: {
    type: Date,
    default: null
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
FeedbackSchema.index({ userId: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model('Feedback', FeedbackSchema);

