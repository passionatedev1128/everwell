import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID é obrigatório']
  },
  simplyBookId: {
    type: String,
    required: false,
    sparse: true
  },
  serviceName: {
    type: String,
    required: [true, 'Nome do serviço é obrigatório'],
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Data do agendamento é obrigatória']
  },
  appointmentTime: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['consultation', 'follow-up', 'evaluation', 'other'],
    default: 'consultation'
  }
}, {
  timestamps: true
});

// Indexes for performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ appointmentDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ userId: 1, appointmentDate: -1 });

export default mongoose.model('Booking', BookingSchema);

