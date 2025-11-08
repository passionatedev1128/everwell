import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Pergunta é obrigatória'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Resposta é obrigatória']
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Faq', FaqSchema);

