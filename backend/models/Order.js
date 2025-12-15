import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID é obrigatório']
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Valor total é obrigatório'],
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentProof: {
    url: String,
    uploadedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Endereço é obrigatório']
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória']
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório']
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório']
    },
    country: {
      type: String,
      default: 'Brasil'
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Order', OrderSchema);

