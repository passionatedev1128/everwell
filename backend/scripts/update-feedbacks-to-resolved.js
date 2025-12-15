import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateFeedbacksToResolved = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Update testimonial feedbacks to resolved status
    const testimonialNames = ['Joana Fontes', 'Maria Silva', 'Antônio Santos'];
    
    const result = await Feedback.updateMany(
      { name: { $in: testimonialNames } },
      { $set: { status: 'resolved' } }
    );

    console.log(`✅ Atualizados ${result.modifiedCount} feedbacks para status 'resolved'`);

    // Show current status
    const feedbacks = await Feedback.find({ name: { $in: testimonialNames } });
    console.log('\n📊 Status atual dos feedbacks:');
    feedbacks.forEach(f => {
      console.log(`   - ${f.name}: ${f.status}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateFeedbacksToResolved();

