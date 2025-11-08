import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    // Accepts any valid email format from any provider (Gmail, Outlook, Yahoo, custom domains, etc.)
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido. Use um endereço de email válido de qualquer provedor.']
  },
  passwordHash: {
    type: String,
    required: function() {
      // Password not required for OAuth users
      return !this.googleId;
    },
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres']
  },
  googleId: {
    type: String,
    default: null,
    sparse: true // Allows multiple null values
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isAuthorized: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationTokenExpires: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: null
  },
  prescriptions: [{
    url: String,
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  documents: {
    medicalPrescription: {
      url: String,
      uploadedAt: Date,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    importAuthorization: {
      url: String,
      uploadedAt: Date,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    },
    proofOfResidence: {
      url: String,
      uploadedAt: Date,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }
  }
}, {
  timestamps: true
});

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model('User', UserSchema);

