import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    console.log('🔗 Tentando conectar com:', mongoUri.replace(/\/\/.*@/, '//***@')); // Hide password
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    const emails = ['joana.fontes@example.com', 'maria.silva@example.com', 'antonio.santos@example.com'];
    
    for (const email of emails) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        console.log(`✅ Usuário encontrado: ${user.name} (${user.email}) - ID: ${user._id}`);
      } else {
        console.log(`❌ Usuário não encontrado: ${email}`);
      }
    }

    // Also check all users
    const allUsers = await User.find({});
    console.log(`\n📊 Total de usuários no banco: ${allUsers.length}`);
    if (allUsers.length > 0) {
      console.log('Usuários encontrados:');
      allUsers.forEach(u => console.log(`  - ${u.name} (${u.email})`));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkUsers();

