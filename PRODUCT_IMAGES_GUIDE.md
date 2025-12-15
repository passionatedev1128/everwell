# Product Images Storage Guide

## Overview
Product images are stored locally in the `backend/uploads/products/` directory and served statically through the Express server.

## Storage Location

### Local Storage (Current Setup)
- **Directory:** `backend/uploads/products/`
- **URL Pattern:** `http://localhost:5000/uploads/products/{filename}`
- **Production URL:** `https://yourdomain.com/uploads/products/{filename}`

### File Structure
```
backend/
  uploads/
    documents/     # User documents (PDF, Word)
    payments/      # Payment proofs (PDF, Word)
    products/      # Product images (JPG, PNG, WEBP) ← NEW
```

## Image Requirements

### Supported Formats
- **JPG/JPEG** - Recommended for photos
- **PNG** - Recommended for graphics with transparency
- **WEBP** - Modern format with better compression

### Size Limits
- **Maximum file size:** 5MB per image
- **Recommended dimensions:** 
  - Product card: 400x400px to 800x800px
  - Product detail: 1200x1200px
  - Aspect ratio: 1:1 (square) recommended

## How to Add Product Images

### Option 1: Manual Upload (Recommended for Initial Setup)

1. **Place images in the products directory:**
   ```bash
   backend/uploads/products/
   ```

2. **Name your images:**
   - Use descriptive names: `gummy-cbd-thc.jpg`, `creme-cbd-cbg.jpg`, `oleo-cbd-cbg.jpg`
   - Or use the format: `{product-slug}_{timestamp}_{name}.{ext}`

3. **Update product in database:**
   ```javascript
   // Example: Update product with image URL
   db.products.updateOne(
     { slug: "gummy-cbd-thc" },
     { 
       $set: { 
         images: ["http://localhost:5000/uploads/products/gummy-cbd-thc.jpg"]
       } 
     }
   );
   ```

### Option 2: Upload via API (When Admin Panel is Ready)

The upload configuration is ready for future admin panel implementation:

```javascript
// Future endpoint: POST /api/admin/products/:id/images
// Uses: uploadProductImage middleware
```

## Image URLs in Database

Product images are stored as URLs in the `images` array field:

```javascript
{
  name: "Gummy de CBD e THC",
  slug: "gummy-cbd-thc",
  images: [
    "http://localhost:5000/uploads/products/gummy-cbd-thc.jpg",
    "http://localhost:5000/uploads/products/gummy-cbd-thc-alt.jpg" // Multiple images supported
  ],
  // ... other fields
}
```

## Production Deployment

### For Production, Consider:

1. **Cloud Storage (Recommended for Production)**
   - **Cloudinary** - Free tier available, automatic image optimization
   - **AWS S3** - Scalable, pay-as-you-go
   - **Google Cloud Storage** - Similar to S3
   - **DigitalOcean Spaces** - S3-compatible, simple pricing

2. **CDN (Content Delivery Network)**
   - Use Cloudflare, CloudFront, or similar
   - Improves image loading speed globally

3. **Image Optimization**
   - Compress images before upload
   - Use WebP format when possible
   - Consider responsive images (different sizes for mobile/desktop)

## Current Setup (Local Development)

### Accessing Images
- **Local:** `http://localhost:5000/uploads/products/{filename}`
- **Static files served by:** Express static middleware in `server.js`

### Example Image URLs
```javascript
// In your product data:
images: [
  "http://localhost:5000/uploads/products/gummy-cbd-thc.jpg",
  "http://localhost:5000/uploads/products/creme-cbd-cbg.jpg",
  "http://localhost:5000/uploads/products/oleo-cbd-cbg.jpg"
]
```

## Quick Start

1. **Create the products directory** (if it doesn't exist):
   ```bash
   mkdir -p backend/uploads/products
   ```

2. **Add your product images:**
   - Copy image files to `backend/uploads/products/`
   - Use descriptive filenames

3. **Update product database:**
   - Use the update script: `node backend/scripts/update-products-from-canva.js`
   - Or manually update image URLs in MongoDB

4. **Verify images are accessible:**
   - Visit: `http://localhost:5000/uploads/products/{your-image.jpg}`
   - Should display the image

## Notes

- The `uploads/` directory should be in `.gitignore` (already configured)
- Images are served statically - no authentication required
- For production, consider moving to cloud storage for better performance
- The upload configuration supports multiple images per product (images array)

