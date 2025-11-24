import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  subtitle: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  restrictions: {
    type: String,
    default: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.'
  },
  visible: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['gummy', 'oleo', 'creme'],
    required: true
  },
  productUrl: {
    type: String,
    default: 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F',
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);

