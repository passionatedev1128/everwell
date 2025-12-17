import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST before importing anything that uses them
dotenv.config();

// Now import modules that depend on environment variables
import passport from './config/passport.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { verifyEmailConfig } from './config/email.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import blogRoutes from './routes/blogs.js';
import faqRoutes from './routes/faqs.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import leadRoutes from './routes/leads.js';
import feedbackRoutes from './routes/feedback.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", process.env.BACKEND_URL, process.env.FRONTEND_URL, "http://localhost:5000", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false // Disable COEP to avoid ORB issues
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'everwell-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files statically with CORS headers (custom handler for ORB compliance)
// IMPORTANT: Use the same path as upload.js to ensure consistency
// upload.js uses path.join(__dirname, 'uploads') where __dirname is the config directory
// So we need to use the config directory's uploads path
const configDir = path.join(__dirname, 'config');
const uploadsPath = path.join(configDir, 'uploads');
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log(`📁 Server uploads path: ${uploadsPath}`);
console.log(`📁 Server __dirname: ${__dirname}`);

// Handle OPTIONS requests for CORS preflight
app.options('/uploads/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', frontendUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.status(200).end();
});
                            
// Custom file serving with proper headers for ORB compliance
app.use('/uploads', (req, res, next) => {
  const filePath = req.path; // e.g., /products/image.png
  const fullPath = path.join(uploadsPath, filePath);
  
  // Log the request for debugging
  console.log(`📂 File request: ${filePath}`);
  console.log(`📁 Full path: ${fullPath}`);
  console.log(`📁 Uploads directory exists: ${fs.existsSync(uploadsPath)}`);
  console.log(`📁 File exists: ${fs.existsSync(fullPath)}`);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    console.error(`📂 Requested path: ${filePath}`);
    console.error(`📁 Uploads root: ${uploadsPath}`);
    
    // List what's actually in the uploads directory
    if (fs.existsSync(uploadsPath)) {
      try {
        const dirs = fs.readdirSync(uploadsPath);
        console.error(`📁 Directories in uploads: ${dirs.join(', ')}`);
        
        // Check products directory
        const productsPath = path.join(uploadsPath, 'products');
        if (fs.existsSync(productsPath)) {
          const files = fs.readdirSync(productsPath);
          console.error(`📁 Files in products: ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`);
        } else {
          console.error(`❌ Products directory does not exist: ${productsPath}`);
        }
      } catch (err) {
        console.error(`❌ Error reading uploads directory: ${err.message}`);
      }
    }
    
    return res.status(404).json({ 
      error: 'File not found',
      path: filePath,
      uploadsPath: uploadsPath
    });
  }
  
  // Continue to static file serving
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, filePath, stat) => {
    // Set CORS headers (critical for ORB)
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Determine Content-Type from file extension
    const ext = path.extname(filePath).toLowerCase();
    const imageTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    // Set explicit Content-Type (critical for ORB)
    if (imageTypes[ext]) {
      res.setHeader('Content-Type', imageTypes[ext]);
    }
    
    // Set cache headers for images
    if (imageTypes[ext] && ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(imageTypes[ext])) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EverWell API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB()
  .then(async () => {
    // Start server first
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Verify email configuration in background (non-blocking)
    // Don't await - let it run after server starts
    verifyEmailConfig().catch(() => {
      // Silently handle errors - already logged in verifyEmailConfig
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

