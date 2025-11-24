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
const productsDir = path.join(uploadsDir, 'products');
const usersDir = path.join(uploadsDir, 'users');

[uploadsDir, documentsDir, paymentsDir, productsDir, usersDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter for documents
const fileFilter = (req, file, cb) => {
  // Allowed file types (documents only)
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Envie apenas documentos PDF ou Word (.doc, .docx).'), false);
  }
};

// File filter for images (products)
const imageFilter = (req, file, cb) => {
  // Allowed image types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Envie apenas imagens (JPG, PNG, WEBP).'), false);
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

// Storage configuration for product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: productSlug_timestamp_originalname or adminId_timestamp_originalname
    const productSlug = req.body?.slug || req.params?.slug;
    const adminId = req.user?._id?.toString() || 'admin';
    const identifier = productSlug || adminId;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const filename = `${identifier}_${timestamp}_${randomSuffix}_${name}${ext}`;
    cb(null, filename);
  }
});

// Multer instance for product images
export const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

// Storage configuration for user photos
const userPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, usersDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?._id?.toString() || req.body?.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'user';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const filename = `photo_${userId}_${timestamp}_${randomSuffix}_${name}${ext}`;
    cb(null, filename);
  }
});

// Multer instance for user photos
export const uploadUserPhoto = multer({
  storage: userPhotoStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

// Helper function to get file URL
export const getFileUrl = (filename, type = 'document') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  let folder = 'documents';
  if (type === 'payment') {
    folder = 'payments';
  } else if (type === 'product') {
    folder = 'products';
  } else if (type === 'user') {
    folder = 'users';
  }
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Helper function to get file path
export const getFilePath = (filename, type = 'document') => {
  let folder = 'documents';
  if (type === 'payment') {
    folder = 'payments';
  } else if (type === 'product') {
    folder = 'products';
  } else if (type === 'user') {
    folder = 'users';
  }
  return path.join(__dirname, '..', 'uploads', folder, filename);
};

