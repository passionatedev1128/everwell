import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const testimonialUsers = [
  {
    name: 'Joana Fontes',
    email: 'joana.fontes@example.com',
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    isAuthorized: true,
    emailVerified: true,
    registrationPending: false
  },
  {
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isAuthorized: true,
    emailVerified: true,
    registrationPending: false
  },
  {
    name: 'Antônio Santos',
    email: 'antonio.santos@example.com',
    photo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
    isAuthorized: true,
    emailVerified: true,
    registrationPending: false
  }
];

const createTestimonialUsers = async () => {
  try {
    // Connect to MongoDB - use same connection string format as other scripts
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/everwell';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create a default password for all testimonial users
    const defaultPassword = 'Testimonial123!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    for (const userData of testimonialUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        // Update existing user
        existingUser.name = userData.name;
        existingUser.photo = userData.photo;
        existingUser.isAuthorized = userData.isAuthorized;
        existingUser.emailVerified = userData.emailVerified;
        existingUser.registrationPending = userData.registrationPending;
        if (!existingUser.passwordHash) {
          existingUser.passwordHash = passwordHash;
        }
        await existingUser.save();
        console.log(`✅ Updated user: ${userData.name}`);
      } else {
        // Create new user
        const user = await User.create({
          ...userData,
          passwordHash,
          provider: 'local',
          role: 'user'
        });
        console.log(`✅ Created user: ${userData.name} (${userData.email})`);
      }
    }

    console.log('\n✅ All testimonial users created/updated successfully!');
    console.log('📧 Default password for all users: Testimonial123!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating testimonial users:', error);
    process.exit(1);
  }
};

createTestimonialUsers();

