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
const uploadsPath = path.join(__dirname, 'uploads');
// Custom route handler for uploads to ensure proper headers for ORB compliance
app.use('/uploads', (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  // Handle OPTIONS request first
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.status(200).end();
  }
  
  // When mounted with app.use('/uploads', ...), req.path is relative to mount point
  // So /uploads/products/image.jpg becomes /products/image.jpg
  const filePath = req.path; // e.g., /products/image.jpg
  
  // Normalize the path to prevent directory traversal
  const normalizedPath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(uploadsPath, normalizedPath);
  
  // Security check: ensure the resolved path is within uploads directory
  const resolvedPath = path.resolve(fullPath);
  const resolvedUploadsPath = path.resolve(uploadsPath);
  if (!resolvedPath.startsWith(resolvedUploadsPath)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  
  // Check if file exists first
  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }
  
  // Get file extension to determine Content-Type
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
  
  // Determine Content-Type
  const contentType = imageTypes[ext] || 'application/octet-stream';
  
  // Set CORS headers FIRST (critical for ORB - must be before Content-Type)
  res.setHeader('Access-Control-Allow-Origin', frontendUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Set Content-Type header (critical for ORB - must be explicit and correct)
  res.setHeader('Content-Type', contentType);
  
  // Set cache headers for images
  if (imageTypes[ext] && ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(imageTypes[ext])) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Use stream to send file - this ensures headers are respected
  const fileStream = fs.createReadStream(fullPath);
  fileStream.on('error', (err) => {
    console.error('Error reading file:', err.message, 'Path:', filePath);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error reading file' });
    }
  });
  
  fileStream.pipe(res);
});

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

