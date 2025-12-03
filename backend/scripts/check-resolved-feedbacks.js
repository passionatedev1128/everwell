import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkResolvedFeedbacks = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Check resolved feedbacks with admin response
    const feedbacks = await Feedback.find({ 
      status: 'resolved',
      respondedBy: { $ne: null }
    })
      .populate('userId', 'name email photo')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`📊 Feedbacks resolvidos com resposta do admin: ${feedbacks.length}\n`);

    if (feedbacks.length === 0) {
      console.log('⚠️  Nenhum feedback encontrado. Verificando todos os feedbacks...\n');
      
      const allFeedbacks = await Feedback.find({})
        .populate('userId', 'name email photo')
        .populate('respondedBy', 'name email')
        .sort({ createdAt: -1 });

      console.log(`📝 Total de feedbacks no banco: ${allFeedbacks.length}\n`);
      
      allFeedbacks.forEach(f => {
        console.log(`- ${f.name}:`);
        console.log(`  Status: ${f.status}`);
        console.log(`  RespondedBy: ${f.respondedBy ? f.respondedBy.name : 'null'}`);
        console.log(`  Response: ${f.response ? 'Sim' : 'Não'}`);
        console.log('');
      });
    } else {
      feedbacks.forEach(f => {
        console.log(`✅ ${f.name}:`);
        console.log(`   Status: ${f.status}`);
        console.log(`   Respondido por: ${f.respondedBy?.name || 'N/A'}`);
        console.log(`   Mensagem: ${f.message.substring(0, 50)}...`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkResolvedFeedbacks();

