import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Testimonials from "Histórias reais de alta performance com EverWell" section
const testimonials = [
  {
    name: 'Joana Fontes',
    email: 'joana.fontes@example.com', // Placeholder email
    rating: 5,
    message: 'Experiência impecável do início ao fim. Performance elevada, sono equilibrado e suporte de alto nível.',
    status: 'reviewed'
  },
  {
    name: 'Maria Silva',
    email: 'maria.silva@example.com', // Placeholder email
    rating: 5,
    message: 'Os protocolos personalizados transformaram minha rotina esportiva. Recuperação mais rápida e foco absoluto.',
    status: 'reviewed'
  },
  {
    name: 'Antônio Santos',
    email: 'antonio.santos@example.com', // Placeholder email
    rating: 5,
    message: 'Nunca tive um acompanhamento tão humanizado. A EverWell entrega ciência, sofisticação e resultado.',
    status: 'reviewed'
  }
];

const seedTestimonials = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI não encontrada no arquivo .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Insert testimonials
    let created = 0;
    let skipped = 0;

    for (const testimonialData of testimonials) {
      // Check if feedback with same name and message already exists
      const existingFeedback = await Feedback.findOne({ 
        name: testimonialData.name,
        message: testimonialData.message
      });
      
      if (existingFeedback) {
        console.log(`⏭️  Feedback de "${testimonialData.name}" já existe, pulando...`);
        skipped++;
      } else {
        await Feedback.create(testimonialData);
        console.log(`✅ Feedback criado: "${testimonialData.name}"`);
        created++;
      }
    }

    console.log('\n📊 Resumo:');
    console.log(`   ✅ Criados: ${created}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
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

