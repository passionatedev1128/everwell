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

// Testimonials from "Histórias reais de alta performance com EverWell" section
// These match exactly what's in frontend/src/pages/Home.jsx
// Status must be 'resolved' to appear on homepage
const testimonials = [
  {
    name: 'Joana Fontes',
    email: 'joana.fontes@example.com',
    title: 'Executiva de Marketing',
    rating: 5,
    message: 'Experiência impecável do início ao fim. Performance elevada, sono equilibrado e suporte de alto nível.',
    status: 'resolved'
  },
  {
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    title: 'Atleta Profissional',
    rating: 5,
    message: 'Os protocolos personalizados transformaram minha rotina esportiva. Recuperação mais rápida e foco absoluto.',
    status: 'resolved'
  },
  {
    name: 'Antônio Santos',
    email: 'antonio.santos@example.com',
    title: 'Empreendedor',
    rating: 5,
    message: 'Nunca tive um acompanhamento tão humanizado. A EverWell entrega ciência, sofisticação e resultado.',
    status: 'resolved'
  }
];

const seedTestimonials = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    if (!mongoUri) {
      console.error('❌ MONGODB_URI ou MONGO_URI não encontrada no arquivo .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Insert testimonials
    let created = 0;
    let skipped = 0;
    let usersNotFound = 0;

    for (const testimonialData of testimonials) {
      // Find the user by email to link the feedback
      const user = await User.findOne({ email: testimonialData.email });
      
      if (!user) {
        console.log(`⚠️  Usuário "${testimonialData.email}" não encontrado. Criando feedback sem userId...`);
        usersNotFound++;
      }

      // Check if feedback with same name and message already exists
      const existingFeedback = await Feedback.findOne({ 
        name: testimonialData.name,
        message: testimonialData.message
      });
      
      if (existingFeedback) {
        console.log(`⏭️  Feedback de "${testimonialData.name}" já existe, pulando...`);
        skipped++;
      } else {
        // Create feedback with userId if user exists
        const feedbackData = {
          name: testimonialData.name,
          email: testimonialData.email,
          rating: testimonialData.rating,
          message: testimonialData.message,
          status: testimonialData.status,
          userId: user ? user._id : null
        };

        await Feedback.create(feedbackData);
        console.log(`✅ Feedback criado: "${testimonialData.name}"${user ? ` (vinculado ao usuário ${user.name})` : ' (sem usuário vinculado)'}`);
        created++;
      }
    }

    console.log('\n📊 Resumo:');
    console.log(`   ✅ Criados: ${created}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
    if (usersNotFound > 0) {
      console.log(`   ⚠️  Usuários não encontrados: ${usersNotFound}`);
      console.log(`   💡 Execute primeiro: node backend/scripts/create-testimonial-users.js`);
    }
    console.log(`   📝 Total: ${testimonials.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular testimonials:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedTestimonials();

