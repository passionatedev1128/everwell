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
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    // For product images, serve a placeholder instead of 404
    // This handles cases where database references old/deleted files
    if (filePath.startsWith('/products/') && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)) {
      // Generate a simple SVG placeholder image
      const placeholderSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f3f4f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Image not found</text>
</svg>`;
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Access-Control-Allow-Origin', frontendUrl);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache placeholder for 1 hour
      return res.status(200).send(placeholderSvg);
    }
    
    // For other missing files, log details and return 404
    // This is common on Railway/ephemeral filesystems where files are lost on restart
    console.warn(`⚠️ File not found: ${filePath}`);
    console.warn(`📁 Expected path: ${fullPath}`);
    console.warn(`📁 Uploads base path: ${uploadsPath}`);
    
    // Check if directory exists
    const expectedDir = path.dirname(fullPath);
    if (!fs.existsSync(expectedDir)) {
      console.warn(`⚠️ Directory does not exist: ${expectedDir}`);
      // Try to create it
      try {
        fs.mkdirSync(expectedDir, { recursive: true });
        console.log(`✅ Created directory: ${expectedDir}`);
      } catch (err) {
        console.warn(`⚠️ Cannot create directory: ${err.message}`);
      }
    } else {
      // List files in directory to help debug
      try {
        const files = fs.readdirSync(expectedDir);
        console.warn(`📋 Files in directory (${files.length} total): ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`);
      } catch (err) {
        console.warn(`⚠️ Cannot read directory: ${err.message}`);
      }
    }
    
    // Return 404 with helpful message
    return res.status(404).json({ 
      error: 'File not found',
      message: 'O arquivo pode ter sido removido após uma reinicialização do servidor. Por favor, faça upload novamente.',
      path: filePath
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

