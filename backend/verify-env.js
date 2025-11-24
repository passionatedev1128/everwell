// Script to verify environment variables are loaded correctly
// Run: node verify-env.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('\n🔍 Environment Variables Verification\n');
console.log('='.repeat(50));

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file NOT FOUND at:', envPath);
  console.log('   Please create a .env file in the backend folder.');
  process.exit(1);
} else {
  console.log('✅ .env file found at:', envPath);
}

console.log('\n📋 Checking Google OAuth Variables:\n');

// Check Google OAuth variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

if (googleClientId) {
  console.log('✅ GOOGLE_CLIENT_ID: Set');
  console.log('   Value:', googleClientId.substring(0, 30) + '...');
  if (!googleClientId.includes('.apps.googleusercontent.com')) {
    console.log('   ⚠️  Warning: Client ID should end with .apps.googleusercontent.com');
  }
} else {
  console.log('❌ GOOGLE_CLIENT_ID: NOT SET');
  console.log('   Add to .env: GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
}

if (googleClientSecret) {
  console.log('✅ GOOGLE_CLIENT_SECRET: Set');
  console.log('   Value:', googleClientSecret.substring(0, 10) + '... (hidden)');
  if (!googleClientSecret.startsWith('GOCSPX-')) {
    console.log('   ⚠️  Warning: Client Secret usually starts with GOCSPX-');
  }
} else {
  console.log('❌ GOOGLE_CLIENT_SECRET: NOT SET');
  console.log('   Add to .env: GOOGLE_CLIENT_SECRET=your-client-secret');
}

if (googleCallbackUrl) {
  console.log('✅ GOOGLE_CALLBACK_URL: Set');
  console.log('   Value:', googleCallbackUrl);
} else {
  console.log('⚠️  GOOGLE_CALLBACK_URL: Not set (using default)');
  console.log('   Default: /api/auth/google/callback');
}

console.log('\n📋 Other Important Variables:\n');

// Check other important variables
const requiredVars = {
  'MONGO_URI': process.env.MONGO_URI,
  'JWT_SECRET': process.env.JWT_SECRET,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'SESSION_SECRET': process.env.SESSION_SECRET || process.env.JWT_SECRET
};

Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: Set`);
  } else {
    console.log(`⚠️  ${key}: Not set`);
  }
});

console.log('\n' + '='.repeat(50));

// Final check
if (googleClientId && googleClientSecret) {
  console.log('\n✅ Google OAuth is properly configured!');
  console.log('   You should NOT see the warning message when starting the server.');
} else {
  console.log('\n❌ Google OAuth is NOT properly configured.');
  console.log('   Please check your .env file and add the missing variables.');
  console.log('\n   Required variables:');
  console.log('   - GOOGLE_CLIENT_ID');
  console.log('   - GOOGLE_CLIENT_SECRET');
}

console.log('\n');

