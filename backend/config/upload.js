import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const documentsDir = path.join(uploadsDir, 'documents');
const paymentsDir = path.join(uploadsDir, 'payments');

[uploadsDir, documentsDir, paymentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter for documents
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use PDF, JPG, PNG ou WEBP.'), false);
  }
};

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp_originalname
    const userId = req.user?._id || 'anonymous';
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const filename = `${userId}_${timestamp}_${name}${ext}`;
    cb(null, filename);
  }
});

// Storage configuration for payment proofs
const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paymentsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: orderId_timestamp_originalname
    const orderId = req.params?.id || 'unknown';
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const filename = `${orderId}_${timestamp}_${name}${ext}`;
    cb(null, filename);
  }
});

// Multer instances
export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

export const uploadPaymentProof = multer({
  storage: paymentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Helper function to get file URL
export const getFileUrl = (filename, type = 'document') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const folder = type === 'payment' ? 'payments' : 'documents';
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Helper function to get file path
export const getFilePath = (filename, type = 'document') => {
  const folder = type === 'payment' ? 'payments' : 'documents';
  return path.join(__dirname, '..', 'uploads', folder, filename);
};

