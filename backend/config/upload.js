import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
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

// Helper function to generate filename
const generateFilename = (req, file, type = 'document') => {
  let filename = '';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);

  if (type === 'document') {
    const userId = req.user?._id?.toString() || 'anonymous';
    filename = `${userId}_${timestamp}_${name}${ext}`;
  } else if (type === 'payment') {
    const orderId = req.params?.id || 'unknown';
    filename = `${orderId}_${timestamp}_${name}${ext}`;
  } else if (type === 'product') {
    const productSlug = req.body?.slug || req.params?.slug;
    const adminId = req.user?._id?.toString() || 'admin';
    const identifier = productSlug || adminId;
    filename = `${identifier}_${timestamp}_${randomSuffix}_${name}${ext}`;
  } else if (type === 'user') {
    const userId = req.user?._id?.toString() || req.body?.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'user';
    filename = `photo_${userId}_${timestamp}_${randomSuffix}_${name}${ext}`;
  }

  return filename;
};

// Helper function to get storage directory based on type
const getStorageDir = (type = 'document') => {
  if (type === 'payment') {
    return paymentsDir;
  } else if (type === 'product') {
    return productsDir;
  } else if (type === 'user') {
    return usersDir;
  }
  return documentsDir;
};

// Configure disk storage for local file storage
const getDiskStorage = (type = 'document') => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = getStorageDir(type);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const filename = generateFilename(req, file, type);
      cb(null, filename);
    }
  });
};

// Multer instances (using disk storage for local file storage)
export const uploadDocument = multer({
  storage: getDiskStorage('document'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

export const uploadPaymentProof = multer({
  storage: getDiskStorage('payment'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Multer instance for product images
export const uploadProductImage = multer({
  storage: getDiskStorage('product'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

// Multer instance for user photos
export const uploadUserPhoto = multer({
  storage: getDiskStorage('user'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

// Helper function to get folder name for URL generation
const getFolderName = (type = 'document') => {
  if (type === 'payment') {
    return 'payments';
  } else if (type === 'product') {
    return 'products';
  } else if (type === 'user') {
    return 'users';
  }
  return 'documents';
};

// Upload file to local storage (replaces Supabase)
// This function is kept for backwards compatibility but now uses local storage
export const uploadToSupabase = async (file, req, type = 'document') => {
  // For disk storage, multer already saved the file, so we just need to generate the URL
  // If file.path exists, it means multer already saved it
  if (file.path) {
    const filename = path.basename(file.path);
    const folder = getFolderName(type);
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const url = `${baseUrl}/uploads/${folder}/${filename}`;
    
    return {
      filename,
      path: file.path,
      url
    };
  }
  
  // Fallback: if file is in memory (buffer), save it manually
  if (file.buffer) {
    const filename = generateFilename(req, file, type);
    const storageDir = getStorageDir(type);
    const filePath = path.join(storageDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    const folder = getFolderName(type);
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const url = `${baseUrl}/uploads/${folder}/${filename}`;
    
    return {
      filename,
      path: filePath,
      url
    };
  }
  
  throw new Error('File upload failed: no file data available');
};

// Helper function to get file URL (returns local URL)
export const getFileUrl = (filename, type = 'document') => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const folder = getFolderName(type);
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Helper function to delete file from local storage
export const deleteFromSupabase = async (filename, type = 'document') => {
  try {
    const storageDir = getStorageDir(type);
    const filePath = path.join(storageDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ File deleted: ${filePath}`);
    } else {
      console.warn(`⚠️ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file (${type}):`, error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

