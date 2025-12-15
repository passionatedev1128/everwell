# Document Upload Error Troubleshooting Guide

## 🔍 Common Errors and Solutions

### Issue 1: "Erro ao enviar documento. Tente novamente."

**Possible Causes:**
1. Backend API not running
2. Authentication token expired
3. File validation failed
4. Network error
5. Backend route not configured

**Solutions:**

#### Check 1: Browser Console Errors
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try uploading a document
4. Look for error messages

**Common errors:**
- `Network Error` → Backend not running or wrong API URL
- `401 Unauthorized` → Token expired, need to login again
- `404 Not Found` → Route not found, check backend routes
- `413 Payload Too Large` → File too large (over 10MB)
- `400 Bad Request` → Invalid file type or document type

#### Check 2: Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try uploading a document
4. Look for the request to `/api/users/documents/[documentType]`
5. Check:
   - **Status code** (should be 200 for success)
   - **Request payload** (should have file)
   - **Response** (check error message)

#### Check 3: Backend Logs
1. Check your backend console/terminal
2. Look for error messages when uploading
3. Common backend errors:
   - `MulterError: File too large`
   - `ValidationError`
   - `ENOENT: no such file or directory` (upload directory doesn't exist)

---

### Issue 2: Tracking Code Error (GA4/HubSpot)

**Symptom:** Upload succeeds but error appears, or upload fails with tracking error

**Possible Cause:** Tracking code throws error after successful upload

**Solution:** The tracking code should be wrapped in try-catch to prevent breaking the upload flow.

**Fix:** Update `DocumentUpload.jsx` to handle tracking errors gracefully.

---

### Issue 3: File Type Validation Error

**Error Message:** "Tipo de arquivo não permitido. Use PDF, JPG, PNG ou WEBP."

**Cause:** File type not in allowed list

**Allowed Types:**
- `image/jpeg` or `image/jpg`
- `image/png`
- `image/webp`
- `application/pdf`

**Solution:** Make sure your file is one of these types.

---

### Issue 4: File Size Error

**Error Message:** "Arquivo muito grande. Tamanho máximo: 10MB."

**Cause:** File exceeds 10MB limit

**Solution:** Compress or reduce file size before uploading.

---

### Issue 5: Authentication Error

**Error Message:** "401 Unauthorized" or redirects to login

**Cause:** 
- Token expired
- Not logged in
- Invalid token

**Solution:**
1. Log out and log back in
2. Check if token exists in localStorage
3. Verify backend authentication middleware

---

### Issue 6: Backend Route Not Found

**Error Message:** "404 Not Found"

**Cause:** Backend route not configured or wrong URL

**Check:**
1. Verify route exists: `POST /api/users/documents/:documentType`
2. Check API URL in `.env`: `VITE_API_URL`
3. Verify backend server is running

---

## 🔧 Step-by-Step Debugging

### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try uploading a document
4. Note any error messages

**What to look for:**
```javascript
// Good - no errors
GA4: Event tracked { eventName: 'document_upload', ... }
HubSpot: Event tracked { eventName: 'document_upload', ... }

// Bad - errors
Error: ...
Failed to track event: ...
Network Error: ...
```

---

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter for: `documents`
4. Try uploading a document
5. Click on the request
6. Check:
   - **Status:** Should be 200 (green)
   - **Request Headers:** Should have `Authorization: Bearer [token]`
   - **Request Payload:** Should have file data
   - **Response:** Should have `{ success: true, ... }`

**Common status codes:**
- `200` → Success ✅
- `400` → Bad request (invalid file/type)
- `401` → Unauthorized (need to login)
- `404` → Route not found
- `413` → File too large
- `500` → Server error

---

### Step 3: Check Backend Logs

1. Open backend terminal/console
2. Try uploading a document
3. Look for error messages

**Common backend errors:**
```
Error: ENOENT: no such file or directory 'uploads/documents'
→ Solution: Create uploads/documents directory

MulterError: File too large
→ Solution: File exceeds 10MB limit

ValidationError: Invalid document type
→ Solution: Check documentType parameter
```

---

### Step 4: Test API Directly

Test the API endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/users/documents/medicalPrescription \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Documento enviado com sucesso. Aguarde a análise.",
  "document": {
    "url": "...",
    "uploadedAt": "...",
    "status": "pending"
  }
}
```

---

## 🛠️ Quick Fixes

### Fix 1: Wrap Tracking in Try-Catch

Update `DocumentUpload.jsx` to prevent tracking errors from breaking upload:

```javascript
try {
  const response = await api.uploadDocument(documentType, file);
  if (response.success) {
    // Track document upload (wrap in try-catch to prevent errors)
    try {
      trackDocumentUpload(documentType);
    } catch (trackingError) {
      console.warn('GA4 tracking error:', trackingError);
    }
    
    try {
      trackLead(documentType);
    } catch (trackingError) {
      console.warn('HubSpot tracking error:', trackingError);
    }
    
    try {
      gtmTrackDocumentUpload(documentType);
    } catch (trackingError) {
      console.warn('GTM tracking error:', trackingError);
    }
    
    // ... rest of success handling
  }
} catch (error) {
  // ... error handling
}
```

---

### Fix 2: Verify Backend Upload Directory Exists

Check if upload directory exists:

```bash
# In backend directory
ls -la uploads/documents
```

If it doesn't exist, create it:

```bash
mkdir -p uploads/documents
```

---

### Fix 3: Check Environment Variables

Verify API URL is correct:

```javascript
// In browser console
console.log('API URL:', import.meta.env.VITE_API_URL);
```

Should be: `http://localhost:5000/api` (or your production URL)

---

## 📋 Error Checklist

Use this checklist to diagnose the issue:

- [ ] **Browser Console:** Check for JavaScript errors
- [ ] **Network Tab:** Check request status and response
- [ ] **Backend Logs:** Check for server errors
- [ ] **File Type:** Verify file is PDF, JPG, PNG, or WEBP
- [ ] **File Size:** Verify file is under 10MB
- [ ] **Authentication:** Verify user is logged in
- [ ] **API URL:** Verify `VITE_API_URL` is correct
- [ ] **Backend Running:** Verify backend server is running
- [ ] **Upload Directory:** Verify `uploads/documents` exists
- [ ] **Route Configuration:** Verify route is registered

---

## 🚨 Common Error Messages and Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Tipo de arquivo não permitido" | Invalid file type | Use PDF, JPG, PNG, or WEBP |
| "Arquivo muito grande" | File > 10MB | Compress file or reduce size |
| "401 Unauthorized" | Token expired | Log out and log back in |
| "404 Not Found" | Route not found | Check backend routes |
| "Network Error" | Backend not running | Start backend server |
| "Erro ao enviar documento" | Generic error | Check browser console and backend logs |

---

## 🔍 Detailed Error Investigation

### If Upload Fails Immediately:

1. **Check file validation** (client-side)
   - File type check (line 48-57)
   - File size check (line 59-68)

### If Upload Starts But Fails:

1. **Check API call** (line 75)
   - Network request
   - Response status
   - Error message in response

### If Upload Succeeds But Error Appears:

1. **Check tracking code** (lines 78-80)
   - GA4 tracking
   - HubSpot tracking
   - GTM tracking

---

## 💡 Pro Tips

1. **Always check browser console first** - Most errors show there
2. **Check network tab** - See actual API request/response
3. **Check backend logs** - Server-side errors appear there
4. **Test with small file first** - Rule out file size issues
5. **Test with different file types** - Rule out file type issues
6. **Check authentication** - Make sure you're logged in

---

## 📞 Still Having Issues?

If you're still getting errors after trying these solutions:

1. **Share the exact error message** from browser console
2. **Share the network request details** (status code, response)
3. **Share backend error logs** (if any)
4. **Share file details** (type, size)

This will help identify the specific issue.

