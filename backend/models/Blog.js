import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contentMarkdown: {
    type: String,
    required: [true, 'Conteúdo é obrigatório']
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  imageUrl: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Blog', BlogSchema);

