import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'admin@everwell.com';
    const adminPassword = 'admin123456';
    const adminName = 'Admin EverWell';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('\nTo reset password, delete the user first or update manually in MongoDB.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isAuthorized: true,
      emailVerified: true,
      registrationPending: false
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + adminEmail);
    console.log('🔑 Password: ' + adminPassword);
    console.log('👤 Name:     ' + adminName);
    console.log('🔐 Role:     admin');
    console.log('✅ Authorized: true');
    console.log('✅ Email Verified: true');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now login with these credentials!');
    console.log('🚀 Start the server and login at: http://localhost:5173/login\n');

    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    // Close database connection on error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

createAdmin();

