import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSupabaseClient } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Use memory storage to get file buffer for Supabase upload
const memoryStorage = multer.memoryStorage();

// Multer instances (using memory storage for Supabase)
export const uploadDocument = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

export const uploadPaymentProof = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Multer instance for product images
export const uploadProductImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

// Multer instance for user photos
export const uploadUserPhoto = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max for images
  }
});

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

// Helper function to get Supabase bucket name
const getBucketName = (type = 'document') => {
  if (type === 'payment') {
    return 'payments';
  } else if (type === 'product') {
    return 'products';
  } else if (type === 'user') {
    return 'users';
  }
  return 'documents';
};

// Upload file to Supabase Storage
export const uploadToSupabase = async (file, req, type = 'document') => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  const filename = generateFilename(req, file, type);
  const bucket = getBucketName(type);

  // Upload file buffer to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false // Don't overwrite existing files
    });

  if (error) {
    console.error(`❌ Supabase upload error (${type}):`, error);
    throw new Error(`Failed to upload file to Supabase: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return {
    filename,
    path: data.path,
    url: urlData.publicUrl
  };
};

// Helper function to get file URL (now returns Supabase URL)
export const getFileUrl = (filename, type = 'document') => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    // Fallback to backend URL if Supabase not configured
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    let folder = 'documents';
    if (type === 'payment') {
      folder = 'payments';
    } else if (type === 'product') {
      folder = 'products';
    } else if (type === 'user') {
      folder = 'users';
    }
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }

  const bucket = getBucketName(type);
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return data.publicUrl;
};

// Helper function to delete file from Supabase Storage
export const deleteFromSupabase = async (filename, type = 'document') => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const bucket = getBucketName(type);
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filename]);

  if (error) {
    console.error(`❌ Supabase delete error (${type}):`, error);
    throw new Error(`Failed to delete file from Supabase: ${error.message}`);
  }
};

