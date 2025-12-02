import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Map of names to emails (matching the testimonial users)
const userEmailMap = {
  'Joana Fontes': 'joana.fontes@example.com',
  'Maria Silva': 'maria.silva@example.com',
  'Antônio Santos': 'antonio.santos@example.com'
};

const linkFeedbacksToUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    if (!mongoUri) {
      console.error('❌ MONGODB_URI ou MONGO_URI não encontrada no arquivo .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    let linked = 0;
    let notFound = 0;
    let alreadyLinked = 0;

    // Get all feedbacks that match our testimonial names
    const feedbacks = await Feedback.find({
      name: { $in: Object.keys(userEmailMap) }
    });

    console.log(`📝 Encontrados ${feedbacks.length} feedbacks para vincular\n`);

    for (const feedback of feedbacks) {
      const email = userEmailMap[feedback.name];
      
      if (!email) {
        console.log(`⚠️  Email não encontrado para "${feedback.name}", pulando...`);
        notFound++;
        continue;
      }

      // Check if already linked
      if (feedback.userId) {
        console.log(`⏭️  Feedback de "${feedback.name}" já está vinculado, pulando...`);
        alreadyLinked++;
        continue;
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        console.log(`⚠️  Usuário "${email}" não encontrado para "${feedback.name}"`);
        notFound++;
        continue;
      }

      // Link feedback to user
      feedback.userId = user._id;
      await feedback.save();
      console.log(`✅ Feedback de "${feedback.name}" vinculado ao usuário ${user.name} (${user.email})`);
      linked++;
    }

    console.log('\n📊 Resumo:');
    console.log(`   ✅ Vinculados: ${linked}`);
    console.log(`   ⏭️  Já vinculados: ${alreadyLinked}`);
    console.log(`   ⚠️  Não encontrados: ${notFound}`);
    console.log(`   📝 Total processados: ${feedbacks.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao vincular feedbacks:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
linkFeedbacksToUsers();

