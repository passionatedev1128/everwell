import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment variables');
    }

    // Validate that we're using MongoDB Atlas (not localhost)
    if (process.env.MONGO_URI.includes('localhost') || process.env.MONGO_URI.includes('127.0.0.1')) {
      console.warn('⚠️  WARNING: MONGO_URI points to localhost. This project uses MongoDB Atlas.');
      console.warn('   Please update MONGO_URI to use MongoDB Atlas connection string.');
      console.warn('   See backend/DATABASE_CONFIGURATION.md for instructions.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    const host = conn.connection.host;
    
    // Check if connected to Atlas (hostname contains mongodb.net)
    if (host.includes('mongodb.net') || host.includes('mongodb.com')) {
      console.log(`✅ MongoDB Atlas Connected: ${host}`);
    } else {
      console.log(`✅ MongoDB Connected: ${host}`);
      console.warn('⚠️  Note: This project is configured to use MongoDB Atlas (cloud database)');
    }
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB Atlas username and password in MONGO_URI');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.error('💡 Check your MongoDB Atlas connection string and network access settings');
    }
    throw error;
  }
};

