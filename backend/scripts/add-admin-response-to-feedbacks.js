import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const addAdminResponseToFeedbacks = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Find an admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ Nenhum usuário admin encontrado. Crie um admin primeiro.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Admin encontrado: ${admin.name} (${admin.email})\n`);

    // Update testimonial feedbacks to have admin response
    const testimonialNames = ['Joana Fontes', 'Maria Silva', 'Antônio Santos'];
    
    const feedbacks = await Feedback.find({ name: { $in: testimonialNames } });
    
    if (feedbacks.length === 0) {
      console.log('⚠️  Nenhum feedback de testimonial encontrado.');
      await mongoose.disconnect();
      process.exit(0);
    }

    let updated = 0;
    for (const feedback of feedbacks) {
      // Only update if it doesn't already have a response
      if (!feedback.respondedBy) {
        feedback.status = 'resolved';
        feedback.response = 'Obrigado pelo seu feedback! Ficamos felizes em saber que você está satisfeito com nossos serviços.';
        feedback.respondedAt = new Date();
        feedback.respondedBy = admin._id;
        await feedback.save();
        console.log(`✅ Feedback de "${feedback.name}" atualizado com resposta do admin`);
        updated++;
      } else {
        console.log(`⏭️  Feedback de "${feedback.name}" já tem resposta do admin`);
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Atualizados: ${updated}`);
    console.log(`   ⏭️  Já tinham resposta: ${feedbacks.length - updated}`);
    console.log(`   📝 Total: ${feedbacks.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

addAdminResponseToFeedbacks();

